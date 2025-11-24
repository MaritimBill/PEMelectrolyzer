// Real MQTT Handler for HE-NMPC Dashboard
class RealMQTTHandler {
    constructor() {
        this.client = null;
        this.isConnected = false;
        this.realData = {
            production: 0,
            efficiency: 0,
            oxygen: 0,
            safety: 0,
            economicSP: 0,
            safetySP: 0,
            water: 0,
            chamberTemp: 0,
            battery: 0,
            purity: 0
        };
    }

    connect() {
        // Connect to the same MQTT broker as Arduino/MATLAB
        const options = {
            host: 'broker.hivemq.com',
            port: 8083,
            protocol: 'wss',
            path: '/mqtt'
        };

        this.client = mqtt.connect(options);

        this.client.on('connect', () => {
            console.log('✅ Connected to MQTT broker');
            this.isConnected = true;
            this.subscribeToTopics();
            this.updateConnectionStatus(true);
        });

        this.client.on('message', (topic, message) => {
            this.handleRealData(topic, message.toString());
        });

        this.client.on('error', (error) => {
            console.error('❌ MQTT error:', error);
            this.updateConnectionStatus(false);
        });
    }

    subscribeToTopics() {
        // Subscribe to real data topics from Arduino and MATLAB
        this.client.subscribe('electrolyzer/arduino/data');
        this.client.subscribe('electrolyzer/matlab/data');
        this.client.subscribe('electrolyzer/web/data');
        console.log('👂 Subscribed to real data topics');
    }

    handleRealData(topic, message) {
        try {
            const data = JSON.parse(message);
            console.log('📨 Real data received:', data);

            // Update real data object
            this.updateRealData(data);
            
            // Update charts with real data
            this.updateAllCharts();
            
            // Update dashboard displays
            this.updateDashboardDisplays();

        } catch (error) {
            console.error('❌ Error parsing real data:', error);
        }
    }

    updateRealData(data) {
        // Map incoming data to our structure
        this.realData.production = data.production || data.productionRate || 0;
        this.realData.efficiency = data.efficiency || data.smoothEfficiency || 0;
        this.realData.oxygen = data.oxygen || data.oxygenLevel || data.oxygenReserve || 0;
        this.realData.safety = data.safetyMargin || data.safety || 0;
        this.realData.economicSP = data.economicSetpoint || 0;
        this.realData.safetySP = data.safetySetpoint || 0;
        this.realData.water = data.water || data.waterLevel || 0;
        this.realData.chamberTemp = data.chamber || data.chamberTemp || 0;
        this.realData.battery = data.battery || data.batteryVoltage || 0;
        this.realData.purity = data.purity || data.purityLevel || 0;
    }

    updateAllCharts() {
        // Update all charts with real data
        if (window.productionChart) {
            window.productionChart.data.datasets[0].data.push(this.realData.production);
            window.productionChart.update('none');
        }

        if (window.efficiencyChart) {
            window.efficiencyChart.data.datasets[0].data.push(this.realData.efficiency);
            window.efficiencyChart.update('none');
        }

        if (window.safetyChart) {
            window.safetyChart.data.datasets[0].data.push(this.realData.safety);
            window.safetyChart.update('none');
        }

        if (window.oxygenChart) {
            window.oxygenChart.data.datasets[0].data.push(this.realData.oxygen);
            window.oxygenChart.update('none');
        }
    }

    updateDashboardDisplays() {
        // Update all dashboard elements with real data
        this.updateElement('production-value', this.realData.production.toFixed(1) + '%');
        this.updateElement('efficiency-value', this.realData.efficiency.toFixed(1) + '%');
        this.updateElement('safety-value', this.realData.safety.toFixed(1) + '%');
        this.updateElement('oxygen-value', this.realData.oxygen.toFixed(1) + '%');
        this.updateElement('economic-sp-value', this.realData.economicSP.toFixed(1) + '%');
        this.updateElement('safety-sp-value', this.realData.safetySP.toFixed(1) + '%');
        this.updateElement('water-value', this.realData.water.toFixed(1) + '%');
        this.updateElement('temp-value', this.realData.chamberTemp.toFixed(1) + '°C');
        this.updateElement('battery-value', this.realData.battery.toFixed(1) + 'V');
        this.updateElement('purity-value', this.realData.purity.toFixed(1) + '%');
    }

    updateElement(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }

    updateConnectionStatus(connected) {
        const statusElement = document.getElementById('connection-status');
        if (statusElement) {
            statusElement.textContent = connected ? '🟢 CONNECTED' : '🔴 DISCONNECTED';
            statusElement.className = connected ? 'status-connected' : 'status-disconnected';
        }
    }

    // Send commands to Arduino/MATLAB
    sendCommand(command, value = null) {
        if (!this.isConnected) {
            console.error('❌ Not connected to MQTT');
            return;
        }

        const message = {
            command: command,
            timestamp: Date.now()
        };

        if (value !== null) {
            message.value = value;
        }

        this.client.publish('electrolyzer/web/commands', JSON.stringify(message));
        console.log('📤 Command sent:', command, value);
    }

    // Specific command methods
    setEconomicSetpoint(value) {
        this.sendCommand('SET_ECONOMIC_SETPOINT', value);
    }

    startSystem() {
        this.sendCommand('START');
    }

    stopSystem() {
        this.sendCommand('STOP');
    }

    setManualMode() {
        this.sendCommand('SET_MANUAL_MODE');
    }

    setAutoMode() {
        this.sendCommand('SET_AUTO_MODE');
    }

    useMatlabData() {
        this.sendCommand('USE_MATLAB_DATA');
    }

    useSimulationData() {
        this.sendCommand('USE_SIMULATION_DATA');
    }
}

// Initialize and export
const mqttHandler = new RealMQTTHandler();
window.mqttHandler = mqttHandler;

// Start connection when page loads
document.addEventListener('DOMContentLoaded', function() {
    mqttHandler.connect();
});
