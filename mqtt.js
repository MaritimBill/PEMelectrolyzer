// MQTT Communication Layer - Web Compatible
class MQTTManager {
    constructor() {
        this.config = {
            // Public MQTT brokers that work on web
            broker: 'wss://broker.emqx.io:8084/mqtt',
            // Alternative: 'wss://test.mosquitto.org:8081',
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
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
    }

    connect() {
        try {
            console.log('🔌 Connecting to MQTT broker:', this.config.broker);
            
            this.client = mqtt.connect(this.config.broker, {
                clientId: 'he-nmpc-web-' + Math.random().toString(16).substr(2, 8),
                clean: true,
                reconnectPeriod: 1000,
                connectTimeout: 30 * 1000,
            });

            this.client.on('connect', () => {
                this.isConnected = true;
                this.reconnectAttempts = 0;
                this.subscribeToTopics();
                this.showNotification('HE-NMPC Connected to MQTT Broker', 'success');
                console.log('✅ MQTT Connected successfully');
            });

            this.client.on('message', (topic, message) => {
                this.handleMessage(topic, message);
            });

            this.client.on('error', (error) => {
                console.error('❌ MQTT Error:', error);
                this.showNotification('MQTT Connection Error', 'error');
            });

            this.client.on('reconnect', () => {
                this.reconnectAttempts++;
                console.log(`🔄 MQTT Reconnecting... Attempt ${this.reconnectAttempts}`);
                if (this.reconnectAttempts >= this.maxReconnectAttempts) {
                    this.showNotification('MQTT reconnection failed. Using offline mode.', 'warning');
                }
            });

            this.client.on('offline', () => {
                this.isConnected = false;
                console.log('📴 MQTT Offline');
                this.showNotification('MQTT Connection Lost', 'warning');
            });

        } catch (error) {
            console.error('❌ MQTT Connection Failed:', error);
            this.showNotification('MQTT Setup Failed', 'error');
        }
    }

    subscribeToTopics() {
        Object.values(this.config.topics).forEach(topic => {
            this.client.subscribe(topic, { qos: 0 }, (err) => {
                if (err) {
                    console.error(`❌ Failed to subscribe to ${topic}:`, err);
                } else {
                    console.log(`✅ Subscribed to ${topic}`);
                }
            });
        });
    }

    handleMessage(topic, message) {
        try {
            const data = JSON.parse(message.toString());
            console.log(`📨 MQTT Message [${topic}]:`, data);
            
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
            console.error('❌ Message parse error:', e);
        }
    }

    handleSimulinkData(data) {
        // Update frontend with Simulink data
        const updates = {
            'productionRate': data.o2Production,
            'efficiency': data.efficiency,
            'safetyMargin': data.safetyMargin,
            'systemStatus': data.systemStatus || 'OPERATIONAL'
        };

        Object.entries(updates).forEach(([elementId, value]) => {
            const element = document.getElementById(elementId);
            if (element && value !== undefined) {
                element.textContent = typeof value === 'number' ? value.toFixed(1) + '%' : value;
            }
        });

        // Update charts if available
        if (window.chartManager) {
            window.chartManager.updateChartsWithRealTimeData(data);
        }

        console.log('📥 Simulink Data Processed:', data);
    }

    handleArduinoData(data) {
        // Update frontend with Arduino data
        if (data.safetySetpoint !== undefined) {
            document.getElementById('safetyValue').textContent = data.safetySetpoint.toFixed(1) + '%';
        }
        
        if (data.constraintsViolated !== undefined) {
            const statusElement = document.getElementById('systemStatus');
            if (statusElement) {
                statusElement.textContent = data.constraintsViolated ? 'CONSTRAINT VIOLATION' : 'OPERATIONAL';
                statusElement.style.color = data.constraintsViolated ? '#ef4444' : '#10b981';
            }
        }

        console.log('📥 Arduino Data Processed:', data);
    }

    updateDashboard(data) {
        // Generic dashboard update
        const elements = {
            'productionRate': data.productionRate,
            'efficiency': data.efficiency,
            'safetyMargin': data.safetyMargin,
            'systemStatus': data.systemStatus
        };

        Object.entries(elements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element && value !== undefined) {
                element.textContent = typeof value === 'number' ? value.toFixed(1) + '%' : value;
            }
        });
    }

    // Command methods
    sendToSimulink(command, data = {}) {
        const message = {
            command: command,
            timestamp: new Date().toISOString(),
            source: 'web-dashboard',
            ...data
        };
        this.publish(this.config.topics.simulink_out, message);
    }

    sendToArduino(command, data = {}) {
        const message = {
            command: command,
            timestamp: new Date().toISOString(),
            source: 'web-dashboard',
            ...data
        };
        this.publish(this.config.topics.arduino_out, message);
    }

    sendUpperLayerCommand(command) {
        const economicSetpoint = document.getElementById('economicSetpoint').value;
        const message = {
            command: command,
            layer: 'UPPER',
            timestamp: new Date().toISOString(),
            setpoint: parseInt(economicSetpoint),
            source: 'web-dashboard'
        };
        this.publish(this.config.topics.upper_commands, message);
        this.showNotification('Economic Optimization Started', 'success');
    }

    sendLowerLayerCommand(command) {
        const message = {
            command: command,
            layer: 'LOWER',
            timestamp: new Date().toISOString(),
            source: 'web-dashboard'
        };
        this.publish(this.config.topics.lower_commands, message);
        this.showNotification('Safety Layer Calibration Initiated', 'success');
    }

    publish(topic, data) {
        if (this.isConnected) {
            this.client.publish(topic, JSON.stringify(data), { qos: 0 }, (err) => {
                if (err) {
                    console.error('❌ Publish error:', err);
                    this.showNotification('Failed to send command', 'error');
                } else {
                    console.log(`📤 Published to ${topic}:`, data);
                }
            });
        } else {
            console.warn('⚠️ MQTT not connected - cannot publish');
            this.showNotification('Not connected to MQTT', 'warning');
        }
    }

    disconnect() {
        if (this.client) {
            this.client.end();
            this.isConnected = false;
            console.log('🔌 MQTT Disconnected');
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.getElementById('notification');
        const text = document.getElementById('notificationText');
        const icon = notification.querySelector('i');
        
        if (!notification || !text) return;
        
        // Update icon based on type
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };
        
        if (icon) {
            icon.className = `fas ${icons[type] || icons.info}`;
        }
        
        text.textContent = message;
        notification.className = `notification ${type}`;
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 4000);
    }
}

// Initialize MQTT manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.mqttManager = new MQTTManager();
    window.mqttManager.connect();
});

// Handle page unload
window.addEventListener('beforeunload', function() {
    if (window.mqttManager) {
        window.mqttManager.disconnect();
    }
});
