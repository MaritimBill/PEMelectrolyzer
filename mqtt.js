// MQTT Communication Layer
class MQTTManager {
    constructor() {
        this.config = {
            broker: 'wss://broker.hivemq.com:8884/mqtt',
            topics: {
                data: 'electrolyzer/he-nmpc/data',
                upper_commands: 'electrolyzer/he-nmpc/upper_commands',
                lower_commands: 'electrolyzer/he-nmpc/lower_commands',
                simulink_out: 'electrolyzer/simulink/out',
                simulink_in: 'electrolyzer/simulink/in',
                arduino_out: 'electrolyzer/arduino/out',
                arduino_in: 'electrolyzer/arduino/in'
            }
        };
        this.client = null;
        this.isConnected = false;
    }

    connect() {
        try {
            this.client = mqtt.connect(this.config.broker, {
                clientId: 'he-nmpc-dashboard-' + Math.random().toString(16).substr(2, 8)
            });

            this.client.on('connect', () => {
                this.isConnected = true;
                this.subscribeToTopics();
                this.showNotification('HE-NMPC System Connected to MQTT Broker', 'success');
                console.log('✅ MQTT Connected');
            });

            this.client.on('message', (topic, message) => {
                this.handleMessage(topic, message);
            });

            this.client.on('error', (error) => {
                console.error('MQTT Error:', error);
                this.showNotification('MQTT Connection Error', 'error');
            });

        } catch (error) {
            console.error('MQTT Connection Error:', error);
        }
    }

    subscribeToTopics() {
        Object.values(this.config.topics).forEach(topic => {
            this.client.subscribe(topic, (err) => {
                if (!err) console.log(`✅ Subscribed to ${topic}`);
            });
        });
    }

    handleMessage(topic, message) {
        try {
            const data = JSON.parse(message.toString());
            
            switch(topic) {
                case this.config.topics.simulink_in:
                    this.handleSimulinkData(data);
                    break;
                case this.config.topics.arduino_in:
                    this.handleArduinoData(data);
                    break;
                case this.config.topics.data:
                    this.updateDashboard(data);
                    break;
                default:
                    console.log('Received message on topic:', topic, data);
            }
        } catch (e) {
            console.error('Message parse error:', e);
        }
    }

    handleSimulinkData(data) {
        // Update frontend with Simulink data
        if (data.o2Production !== undefined) {
            document.getElementById('productionRate').textContent = data.o2Production.toFixed(1) + '%';
        }
        if (data.efficiency !== undefined) {
            document.getElementById('efficiency').textContent = data.efficiency.toFixed(1) + '%';
        }
        console.log('📥 Simulink Data:', data);
    }

    handleArduinoData(data) {
        // Update frontend with Arduino data
        if (data.safetySetpoint !== undefined) {
            document.getElementById('safetyValue').textContent = data.safetySetpoint.toFixed(1) + '%';
        }
        console.log('📥 Arduino Data:', data);
    }

    sendToSimulink(command, data = {}) {
        const message = {
            command: command,
            timestamp: new Date().toISOString(),
            ...data
        };
        this.publish(this.config.topics.simulink_out, message);
    }

    sendToArduino(command, data = {}) {
        const message = {
            command: command,
            timestamp: new Date().toISOString(),
            ...data
        };
        this.publish(this.config.topics.arduino_out, message);
    }

    sendUpperLayerCommand(command) {
        const message = {
            command: command,
            layer: 'UPPER',
            timestamp: new Date().toISOString(),
            setpoint: document.getElementById('economicSetpoint').value
        };
        this.publish(this.config.topics.upper_commands, message);
        this.showNotification('Economic Optimization Started', 'success');
    }

    sendLowerLayerCommand(command) {
        const message = {
            command: command,
            layer: 'LOWER',
            timestamp: new Date().toISOString()
        };
        this.publish(this.config.topics.lower_commands, message);
        this.showNotification('Safety Layer Calibration Initiated', 'success');
    }

    publish(topic, data) {
        if (this.isConnected) {
            this.client.publish(topic, JSON.stringify(data));
            console.log(`📤 Published to ${topic}:`, data);
        } else {
            console.warn('MQTT not connected');
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.getElementById('notification');
        const text = document.getElementById('notificationText');
        
        text.textContent = message;
        notification.className = `notification ${type}`;
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
}