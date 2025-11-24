import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import json
import logging

class DataProcessor:
    def __init__(self):
        self.historical_data = pd.DataFrame()
        self.real_time_data = {}
        self.logger = logging.getLogger(__name__)

    def process_simulink_data(self, raw_data):
        """Process data received from Simulink"""
        try:
            processed = {
                'timestamp': datetime.now(),
                'o2_production': float(raw_data.get('o2Production', 0)),
                'efficiency': float(raw_data.get('efficiency', 0)),
                'safety_margin': float(raw_data.get('safetyMargin', 0)),
                'stack_temperature': float(raw_data.get('temperature', 0)),
                'system_pressure': float(raw_data.get('pressure', 0)),
                'pv_power': float(raw_data.get('pvPower', 0)),
                'grid_power': float(raw_data.get('gridPower', 0))
            }
            
            # Update real-time data store
            self.real_time_data.update(processed)
            
            # Add to historical data
            self.update_historical_data(processed)
            
            return processed
            
        except Exception as e:
            self.logger.error(f"Error processing Simulink data: {e}")
            return None

    def process_arduino_data(self, raw_data):
        """Process data received from Arduino"""
        try:
            processed = {
                'timestamp': datetime.now(),
                'safety_setpoint': float(raw_data.get('safetySetpoint', 0)),
                'actual_production': float(raw_data.get('actualProduction', 0)),
                'constraints_violated': bool(raw_data.get('constraintsViolated', False)),
                'emergency_protocol': bool(raw_data.get('emergencyProtocol', False)),
                'qp_solve_time': float(raw_data.get('qpSolveTime', 0))
            }
            
            self.real_time_data.update(processed)
            return processed
            
        except Exception as e:
            self.logger.error(f"Error processing Arduino data: {e}")
            return None

    def update_historical_data(self, new_data):
        """Update historical data DataFrame"""
        new_row = pd.DataFrame([new_data])
        
        if self.historical_data.empty:
            self.historical_data = new_row
        else:
            self.historical_data = pd.concat([self.historical_data, new_row], ignore_index=True)
        
        # Keep only last 30 days of data
        cutoff_time = datetime.now() - timedelta(days=30)
        self.historical_data = self.historical_data[
            self.historical_data['timestamp'] > cutoff_time
        ]

    def calculate_metrics(self):
        """Calculate performance metrics from historical data"""
        if self.historical_data.empty:
            return {}
        
        recent_data = self.historical_data.tail(24)  # Last 24 hours
        
        metrics = {
            'average_efficiency': recent_data['efficiency'].mean(),
            'average_production': recent_data['o2_production'].mean(),
            'safety_violations': recent_data[
                recent_data['safety_margin'] < 10
            ].shape[0],
            'pv_utilization_rate': self.calculate_pv_utilization(recent_data),
            'cost_savings': self.calculate_cost_savings(recent_data),
            'system_reliability': self.calculate_reliability(recent_data)
        }
        
        return metrics

    def calculate_pv_utilization(self, data):
        """Calculate PV utilization percentage"""
        total_energy = data['o2_production'].sum()
        pv_energy = data['pv_power'].sum()
        return (pv_energy / total_energy * 100) if total_energy > 0 else 0

    def calculate_cost_savings(self, data):
        """Calculate cost savings from PV usage"""
        # Simplified calculation - replace with actual cost data
        grid_energy = data['grid_power'].sum()
        pv_energy = data['pv_power'].sum()
        total_energy = grid_energy + pv_energy
        
        grid_cost = grid_energy * 0.15  # $0.15 per kWh
        potential_cost = total_energy * 0.15
        savings = potential_cost - grid_cost
        
        return savings

    def calculate_reliability(self, data):
        """Calculate system reliability percentage"""
        total_hours = len(data)
        reliable_hours = data[data['safety_margin'] > 5].shape[0
        return (reliable_hours / total_hours * 100) if total_hours > 0 else 0

    def generate_forecast(self, hours=24):
        """Generate simple forecast based on historical patterns"""
        if self.historical_data.empty:
            return self.generate_default_forecast(hours)
        
        forecast = {}
        
        # Simple forecasting based on daily patterns
        for hour in range(hours):
            target_hour = (datetime.now().hour + hour) % 24
            
            # Get historical data for this hour
            hour_data = self.historical_data[
                self.historical_data['timestamp'].dt.hour == target_hour
            ]
            
            if not hour_data.empty:
                forecast[hour] = {
                    'production': hour_data['o2_production'].mean(),
                    'efficiency': hour_data['efficiency'].mean(),
                    'safety_margin': hour_data['safety_margin'].mean(),
                    'pv_power': hour_data['pv_power'].mean()
                }
            else:
                forecast[hour] = self.generate_default_hour_forecast(target_hour)
        
        return forecast

    def generate_default_forecast(self, hours):
        """Generate default forecast when no historical data is available"""
        forecast = {}
        for hour in range(hours):
            forecast[hour] = self.generate_default_hour_forecast(
                (datetime.now().hour + hour) % 24
            )
        return forecast

    def generate_default_hour_forecast(self, hour):
        """Generate forecast for a specific hour"""
        # Basic diurnal patterns
        if 6 <= hour <= 18:  # Daytime
            pv_power = max(0, 100 * np.sin((hour - 6) * np.pi / 13))
            production = 70 + 0.3 * pv_power
        else:  # Nighttime
            pv_power = 0
            production = 50
        
        return {
            'production': production,
            'efficiency': 75,
            'safety_margin': 25,
            'pv_power': pv_power
        }

    def detect_anomalies(self):
        """Detect anomalies in system operation"""
        if self.historical_data.empty:
            return []
        
        recent_data = self.historical_data.tail(6)  # Last 6 data points
        
        anomalies = []
        
        # Check for sudden efficiency drops
        efficiency_std = recent_data['efficiency'].std()
        efficiency_mean = recent_data['efficiency'].mean()
        
        if efficiency_std > 5:  # High variability
            anomalies.append({
                'type': 'efficiency_instability',
                'severity': 'medium',
                'message': 'High variability in system efficiency detected'
            })
        
        # Check for safety margin violations
        low_safety = recent_data[recent_data['safety_margin'] < 10]
        if not low_safety.empty:
            anomalies.append({
                'type': 'low_safety_margin',
                'severity': 'high',
                'message': f'Safety margin below threshold {len(low_safety)} times'
            })
        
        return anomalies

# Example usage
if __name__ == "__main__":
    processor = DataProcessor()
    
    # Example data processing
    simulink_data = {
        'o2Production': 85.5,
        'efficiency': 78.2,
        'safetyMargin': 22.7,
        'temperature': 67.8,
        'pressure': 45.2,
        'pvPower': 120.5,
        'gridPower': 30.2
    }
    
    processed = processor.process_simulink_data(simulink_data)
    print("Processed Data:", processed)
    
    metrics = processor.calculate_metrics()
    print("Performance Metrics:", metrics)
    
    forecast = processor.generate_forecast(24)
    print("24-hour Forecast Generated")
    
    anomalies = processor.detect_anomalies()
    print("Detected Anomalies:", anomalies)