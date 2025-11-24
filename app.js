// Main application initialization
class HENMPCApp {
    constructor() {
        this.charts = {};
        this.mqttClient = null;
        this.currentPage = 'dashboard';
        this.systemStatus = {
            productionRate: 86.5,
            efficiency: 78.2,
            safetyMargin: 22.7,
            systemStatus: 'OPERATIONAL'
        };
    }

    init() {
        this.initializeCharts();
        this.connectMQTT();
        this.setupEventListeners();
        this.startRealTimeUpdates();
        
        console.log('HE-NMPC Dashboard Initialized');
    }

    setupEventListeners() {
        // Slider events
        document.getElementById('economicSetpoint').addEventListener('input', (e) => {
            document.getElementById('economicValue').textContent = e.target.value + '%';
        });

        // Update time every second
        setInterval(() => this.updateTimeDisplays(), 1000);
    }

    updateTimeDisplays() {
        const now = new Date().toLocaleTimeString();
        document.getElementById('currentTime').textContent = now;
        
        const activePage = document.querySelector('.page.active');
        if (activePage) {
            const timeElement = document.getElementById(activePage.id + 'Time');
            if (timeElement) timeElement.textContent = now;
        }
    }

    startRealTimeUpdates() {
        // Simulate real-time data updates
        setInterval(() => {
            this.updateRealtimeData();
            this.updateCharts();
        }, 2000);
    }

    updateRealtimeData() {
        // Simulate data changes
        this.systemStatus.productionRate += (Math.random() - 0.5) * 2;
        this.systemStatus.efficiency += (Math.random() - 0.5) * 1;
        this.systemStatus.safetyMargin += (Math.random() - 0.5) * 1.5;

        // Update DOM
        document.getElementById('productionRate').textContent = 
            this.systemStatus.productionRate.toFixed(1) + '%';
        document.getElementById('efficiency').textContent = 
            this.systemStatus.efficiency.toFixed(1) + '%';
        document.getElementById('safetyMargin').textContent = 
            this.systemStatus.safetyMargin.toFixed(1) + '%';
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new HENMPCApp();
    window.app.init();
});