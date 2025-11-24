// Simulink MATLAB Bridge
class SimulinkBridge {
    constructor() {
        this.websocket = null;
        this.isConnected = false;
    }

    connect() {
        // WebSocket connection to MATLAB/Simulink
        try {
            this.websocket = new WebSocket('ws://localhost:8080/simulink');
            
            this.websocket.onopen = () => {
                this.isConnected = true;
                console.log('✅ Connected to Simulink');
                this.showNotification('Simulink Connection Established', 'success');
            };
            
            this.websocket.onmessage = (event) => {
                this.handleSimulinkMessage(JSON.parse(event.data));
            };
            
            this.websocket.onerror = (error) => {
                console.error('Simulink WebSocket error:', error);
                this.showNotification('Simulink Connection Error', 'error');
            };
            
            this.websocket.onclose = () => {
                this.isConnected = false;
                console.log('❌ Disconnected from Simulink');
            };
            
        } catch (error) {
            console.error('Simulink connection failed:', error);
        }
    }

    handleSimulinkMessage(data) {
        // Process data from Simulink
        if (data.type === 'telemetry') {
            this.updateTelemetry(data);
        } else if (data.type === 'optimization_result') {
            this.handleOptimizationResult(data);
        }
    }

    updateTelemetry(data) {
        // Update dashboard with real-time telemetry from Simulink
        const updates = {
            'productionRate': data.o2_production,
            'efficiency': data.efficiency,
            'safetyMargin': data.safety_margin,
            'stackTemperature': data.temperature,
            'systemPressure': data.pressure
        };

        Object.entries(updates).forEach(([elementId, value]) => {
            const element = document.getElementById(elementId);
            if (element && value !== undefined) {
                element.textContent = typeof value === 'number' ? value.toFixed(1) + '%' : value;
            }
        });

        // Update charts with new data
        if (window.app && window.app.charts) {
            this.updateChartsWithSimulinkData(data);
        }
    }

    updateChartsWithSimulinkData(data) {
        // Add new data points to charts
        Object.keys(window.app.charts).forEach(chartName => {
            const chart = window.app.charts[chartName];
            if (chart && chart.data && chart.data.datasets) {
                // Add new data point and remove oldest if needed
                chart.data.labels.push(new Date().toLocaleTimeString());
                chart.data.datasets.forEach(dataset => {
                    if (dataset.data.length >= 20) {
                        dataset.data.shift();
                    }
                    // Add simulated data based on telemetry
                    dataset.data.push(this.generateChartData(dataset.label, data));
                });
                
                if (chart.data.labels.length > 20) {
                    chart.data.labels.shift();
                }
                
                chart.update('none');
            }
        });
    }

    generateChartData(datasetLabel, telemetry) {
        // Generate appropriate chart data based on dataset label and telemetry
        const baseValues = {
            'HE-NMPC': telemetry.o2_production || 85,
            'Efficiency': telemetry.efficiency || 75,
            'Safety Margin': telemetry.safety_margin || 25,
            'Stack Temperature': telemetry.temperature || 65
        };
        
        return baseValues[datasetLabel] || Math.random() * 20 + 70;
    }

    sendControlSignal(controlType, value) {
        if (this.isConnected) {
            const message = {
                type: 'control',
                control_type: controlType,
                value: value,
                timestamp: new Date().toISOString()
            };
            this.websocket.send(JSON.stringify(message));
            console.log('📤 Sent to Simulink:', message);
        } else {
            console.warn('Not connected to Simulink');
        }
    }

    requestOptimization(parameters) {
        if (this.isConnected) {
            const message = {
                type: 'optimization_request',
                parameters: parameters,
                timestamp: new Date().toISOString()
            };
            this.websocket.send(JSON.stringify(message));
        }
    }

    showNotification(message, type) {
        // Reuse the notification system from MQTT manager
        if (window.mqttManager) {
            window.mqttManager.showNotification(message, type);
        }
    }
}