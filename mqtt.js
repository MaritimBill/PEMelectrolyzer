// mqtt.js - WORKING VERSION FOR FLAT STRUCTURE
console.log('✅ mqtt.js loaded');

class MQTTManager {
    constructor() {
        this.config = {
            broker: 'wss://broker.emqx.io:8084/mqtt',
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
            console.log('🔌 Connecting to MQTT...');
            this.client = mqtt.connect(this.config.broker, {
                clientId: 'he-nmpc-web-' + Math.random().toString(16).substr(2, 8)
            });

            this.client.on('connect', () => {
                this.isConnected = true;
                this.subscribeToTopics();
                this.showNotification('Connected to MQTT Broker', 'success');
                console.log('✅ MQTT Connected');
                
                // Update status indicator
                const statusElement = document.getElementById('mqttStatus');
                if (statusElement) {
                    statusElement.className = 'fas fa-circle status-indicator connected';
                }
                const statusText = document.getElementById('mqttStatusText');
                if (statusText) {
                    statusText.textContent = 'Connected';
                }
            });

            this.client.on('message', (topic, message) => {
                this.handleMessage(topic, message);
            });

            this.client.on('error', (error) => {
                console.error('MQTT Error:', error);
                this.showNotification('MQTT Connection Error', 'error');
            });

        } catch (error) {
            console.error('MQTT Connection Failed:', error);
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
            console.log(`📨 MQTT [${topic}]:`, data);
            
            // Update dashboard with real data
            if (data.productionRate !== undefined) {
                document.getElementById('productionRate').textContent = data.productionRate.toFixed(1) + '%';
            }
            if (data.efficiency !== undefined) {
                document.getElementById('efficiency').textContent = data.efficiency.toFixed(1) + '%';
            }
            if (data.safetyMargin !== undefined) {
                document.getElementById('safetyMargin').textContent = data.safetyMargin.toFixed(1) + '%';
            }
            
        } catch (e) {
            console.error('Message parse error:', e);
        }
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
        this.showNotification('Safety Layer Calibration Started', 'success');
    }

    publish(topic, data) {
        if (this.isConnected) {
            this.client.publish(topic, JSON.stringify(data));
            console.log(`📤 Published to ${topic}:`, data);
        } else {
            console.warn('MQTT not connected');
            this.showNotification('MQTT Not Connected', 'warning');
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.getElementById('notification');
        const text = document.getElementById('notificationText');
        
        if (notification && text) {
            text.textContent = message;
            notification.className = `notification ${type}`;
            notification.classList.add('show');
            
            setTimeout(() => {
                notification.classList.remove('show');
            }, 3000);
        }
    }
}

// Initialize MQTT when DOM loads
document.addEventListener('DOMContentLoaded', function() {
    window.mqttManager = new MQTTManager();
    window.mqttManager.connect();
});
