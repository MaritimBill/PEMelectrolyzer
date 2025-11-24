import numpy as np
import pandas as pd
from scipy.optimize import minimize
import json
import paho.mqtt.client as mqtt
from datetime import datetime
import logging

class UpperLayerMPC:
    def __init__(self):
        self.horizon = 24  # 24-hour optimization horizon
        self.time_step = 1  # 1-hour steps
        self.optimization_results = {}
        
        # Economic parameters
        self.electricity_prices = self.load_electricity_prices()
        self.pv_forecast = self.load_pv_forecast()
        self.oxygen_demand_forecast = self.load_oxygen_demand()
        
        # System constraints
        self.max_production = 100  # kW
        self.min_production = 10   # kW
        self.max_ramp_rate = 20    # kW/hour
        
        # MQTT setup
        self.setup_mqtt()
        
        logging.basicConfig(level=logging.INFO)
        self.logger = logging.getLogger(__name__)

    def setup_mqtt(self):
        self.mqtt_client = mqtt.Client()
        self.mqtt_client.on_connect = self.on_connect
        self.mqtt_client.on_message = self.on_message
        
        try:
            self.mqtt_client.connect("broker.hivemq.com", 1883, 60)
            self.mqtt_client.loop_start()
        except Exception as e:
            self.logger.error(f"MQTT connection failed: {e}")

    def on_connect(self, client, userdata, flags, rc):
        self.logger.info("Connected to MQTT broker")
        client.subscribe("electrolyzer/he-nmpc/upper_commands")
        client.subscribe("electrolyzer/simulink/out")

    def on_message(self, client, userdata, msg):
        try:
            payload = json.loads(msg.payload.decode())
            self.handle_message(msg.topic, payload)
        except json.JSONDecodeError as e:
            self.logger.error(f"JSON decode error: {e}")

    def handle_message(self, topic, data):
        if topic == "electrolyzer/he-nmpc/upper_commands":
            if data.get('command') == 'RUN_OPTIMIZATION':
                self.run_economic_optimization(data)
        elif topic == "electrolyzer/simulink/out":
            self.update_system_state(data)

    def run_economic_optimization(self, parameters):
        """Run economic optimization for the upper layer"""
        try:
            # Get current system state
            current_state = self.get_current_state()
            
            # Run optimization
            optimized_schedule = self.solve_mpc(current_state)
            
            # Send results to lower layer
            self.send_to_lower_layer(optimized_schedule)
            
            # Log results
            self.log_optimization_results(optimized_schedule)
            
            self.logger.info("Economic optimization completed successfully")
            
        except Exception as e:
            self.logger.error(f"Optimization failed: {e}")

    def solve_mpc(self, current_state):
        """Solve the MPC optimization problem"""
        # Initial guess
        x0 = np.ones(self.horizon) * current_state['production']
        
        # Bounds
        bounds = [(self.min_production, self.max_production)] * self.horizon
        
        # Constraints
        constraints = self.build_constraints(current_state)
        
        # Solve optimization
        result = minimize(
            fun=self.objective_function,
            x0=x0,
            args=(current_state,),
            method='SLSQP',
            bounds=bounds,
            constraints=constraints
        )
        
        if result.success:
            return self.format_solution(result.x, current_state)
        else:
            raise RuntimeError("Optimization failed to converge")

    def objective_function(self, u, current_state):
        """MPC objective function - minimize total cost"""
        total_cost = 0
        
        for k in range(self.horizon):
            # Electricity cost
            electricity_cost = u[k] * self.electricity_prices[k]
            
            # PV utilization penalty (negative when using PV)
            pv_penalty = -self.pv_forecast[k] * 0.1  # Incentivize PV usage
            
            # Demand satisfaction penalty
            demand_penalty = max(0, self.oxygen_demand_forecast[k] - u[k]) * 100
            
            # Ramping penalty
            if k == 0:
                ramp_penalty = (u[k] - current_state['production'])**2 * 0.01
            else:
                ramp_penalty = (u[k] - u[k-1])**2 * 0.01
            
            total_cost += electricity_cost + pv_penalty + demand_penalty + ramp_penalty
        
        return total_cost

    def build_constraints(self, current_state):
        """Build optimization constraints"""
        constraints = []
        
        # Ramping constraints
        for k in range(self.horizon):
            if k == 0:
                def ramp_constraint(u, k=k):
                    return self.max_ramp_rate - abs(u[k] - current_state['production'])
            else:
                def ramp_constraint(u, k=k):
                    return self.max_ramp_rate - abs(u[k] - u[k-1])
            
            constraints.append({'type': 'ineq', 'fun': ramp_constraint})
        
        return constraints

    def format_solution(self, solution, current_state):
        """Format the optimization solution"""
        return {
            'timestamp': datetime.now().isoformat(),
            'optimization_horizon': self.horizon,
            'time_step': self.time_step,
            'setpoints': solution.tolist(),
            'total_cost': self.objective_function(solution, current_state),
            'pv_utilization': self.calculate_pv_utilization(solution),
            'constraints_satisfied': True
        }

    def calculate_pv_utilization(self, solution):
        """Calculate PV utilization percentage"""
        total_pv = sum(self.pv_forecast)
        total_consumption = sum(solution)
        return min(100, (total_pv / total_consumption * 100) if total_consumption > 0 else 0)

    def send_to_lower_layer(self, schedule):
        """Send optimized schedule to lower layer"""
        message = {
            'type': 'economic_setpoint',
            'schedule': schedule,
            'timestamp': datetime.now().isoformat()
        }
        
        self.mqtt_client.publish(
            "electrolyzer/he-nmpc/lower_commands",
            json.dumps(message)
        )

    def get_current_state(self):
        """Get current system state from sensors/Simulink"""
        # This would typically come from real sensors or Simulink
        return {
            'production': 75.0,
            'efficiency': 78.2,
            'safety_margin': 22.7,
            'pv_power': self.pv_forecast[0],
            'oxygen_demand': self.oxygen_demand_forecast[0]
        }

    def update_system_state(self, data):
        """Update system state with real-time data"""
        # Update internal state with real-time measurements
        pass

    def load_electricity_prices(self):
        """Load time-of-use electricity prices"""
        # Mock data - replace with real pricing data
        base_prices = [0.15] * 24
        # Higher prices during peak hours (14-19)
        for hour in range(14, 20):
            base_prices[hour] = 0.25
        # Lower prices during night (22-6)
        for hour in list(range(22, 24)) + list(range(0, 7)):
            base_prices[hour] = 0.10
        return base_prices

    def load_pv_forecast(self):
        """Load PV power forecast"""
        # Mock data - replace with real forecast
        pv_forecast = [0] * 24
        for hour in range(6, 19):
            pv_forecast[hour] = max(0, 100 * np.sin((hour - 6) * np.pi / 13))
        return pv_forecast

    def load_oxygen_demand(self):
        """Load oxygen demand forecast"""
        # Mock data - replace with real hospital demand patterns
        base_demand = [30] * 24
        # Higher demand during daytime
        for hour in range(8, 20):
            base_demand[hour] = 50 + 10 * np.sin((hour - 8) * np.pi / 12)
        return base_demand

    def log_optimization_results(self, results):
        """Log optimization results for analysis"""
        self.optimization_results[datetime.now()] = results
        self.logger.info(f"Optimization completed: Cost = {results['total_cost']:.2f}")

if __name__ == "__main__":
    mpc = UpperLayerMPC()
    
    # Keep the script running
    try:
        while True:
            import time
            time.sleep(10)
    except KeyboardInterrupt:
        mpc.mqtt_client.loop_stop()
        print("MPC stopped")