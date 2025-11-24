// Real Charts for HE-NMPC Dashboard - No Fake Data
class RealCharts {
    constructor() {
        this.charts = {};
        this.maxDataPoints = 50;
    }

    initializeCharts() {
        this.createProductionChart();
        this.createEfficiencyChart();
        this.createSafetyChart();
        this.createOxygenChart();
        this.createSetpointComparisonChart();
    }

    createProductionChart() {
        const ctx = document.getElementById('production-chart').getContext('2d');
        this.charts.production = new Chart(ctx, {
            type: 'line',
            data: {
                labels: this.generateTimeLabels(),
                datasets: [{
                    label: 'Real Production Rate',
                    data: [],
                    borderColor: '#3498db',
                    backgroundColor: 'rgba(52, 152, 219, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: this.getChartOptions('Production Rate (%)')
        });
        window.productionChart = this.charts.production;
    }

    createEfficiencyChart() {
        const ctx = document.getElementById('efficiency-chart').getContext('2d');
        this.charts.efficiency = new Chart(ctx, {
            type: 'line',
            data: {
                labels: this.generateTimeLabels(),
                datasets: [{
                    label: 'Real Efficiency',
                    data: [],
                    borderColor: '#27ae60',
                    backgroundColor: 'rgba(39, 174, 96, 0.1)',
                    borderWidth: 2,
                    fill: true
                }]
            },
            options: this.getChartOptions('Efficiency (%)')
        });
        window.efficiencyChart = this.charts.efficiency;
    }

    createSafetyChart() {
        const ctx = document.getElementById('safety-chart').getContext('2d');
        this.charts.safety = new Chart(ctx, {
            type: 'line',
            data: {
                labels: this.generateTimeLabels(),
                datasets: [{
                    label: 'Real Safety Margin',
                    data: [],
                    borderColor: '#e74c3c',
                    backgroundColor: 'rgba(231, 76, 60, 0.1)',
                    borderWidth: 2,
                    fill: true
                }]
            },
            options: this.getChartOptions('Safety Margin (%)')
        });
        window.safetyChart = this.charts.safety;
    }

    createOxygenChart() {
        const ctx = document.getElementById('oxygen-chart').getContext('2d');
        this.charts.oxygen = new Chart(ctx, {
            type: 'line',
            data: {
                labels: this.generateTimeLabels(),
                datasets: [{
                    label: 'Real Oxygen Level',
                    data: [],
                    borderColor: '#9b59b6',
                    backgroundColor: 'rgba(155, 89, 182, 0.1)',
                    borderWidth: 2,
                    fill: true
                }]
            },
            options: this.getChartOptions('Oxygen Level (%)')
        });
        window.oxygenChart = this.charts.oxygen;
    }

    createSetpointComparisonChart() {
        const ctx = document.getElementById('setpoint-chart').getContext('2d');
        this.charts.setpoint = new Chart(ctx, {
            type: 'line',
            data: {
                labels: this.generateTimeLabels(),
                datasets: [
                    {
                        label: 'Economic Setpoint',
                        data: [],
                        borderColor: '#f39c12',
                        borderWidth: 2,
                        borderDash: [5, 5],
                        fill: false
                    },
                    {
                        label: 'Safety Setpoint',
                        data: [],
                        borderColor: '#e74c3c',
                        borderWidth: 2,
                        fill: false
                    },
                    {
                        label: 'Actual Production',
                        data: [],
                        borderColor: '#3498db',
                        borderWidth: 3,
                        fill: false
                    }
                ]
            },
            options: this.getChartOptions('Setpoint Comparison (%)')
        });
        window.setpointChart = this.charts.setpoint;
    }

    generateTimeLabels() {
        const labels = [];
        for (let i = this.maxDataPoints - 1; i >= 0; i--) {
            labels.push('');
        }
        return labels;
    }

    getChartOptions(title) {
        return {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: title,
                    font: { size: 14, weight: 'bold' }
                },
                legend: {
                    display: true,
                    position: 'top'
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            },
            scales: {
                x: {
                    display: true,
                    title: { display: true, text: 'Time' }
                },
                y: {
                    display: true,
                    title: { display: true, text: 'Value (%)' },
                    min: 0,
                    max: 100
                }
            },
            interaction: {
                intersect: false,
                mode: 'nearest'
            },
            animation: {
                duration: 0 // Disable animation for real-time updates
            }
        };
    }

    // Update charts with real data from MQTT
    updateCharts(realData) {
        this.updateChartData('production', realData.production);
        this.updateChartData('efficiency', realData.efficiency);
        this.updateChartData('safety', realData.safety);
        this.updateChartData('oxygen', realData.oxygen);
        
        // Update setpoint comparison chart
        if (this.charts.setpoint) {
            this.updateChartDataset('setpoint', 0, realData.economicSP);
            this.updateChartDataset('setpoint', 1, realData.safetySP);
            this.updateChartDataset('setpoint', 2, realData.production);
        }
    }

    updateChartData(chartName, value) {
        if (this.charts[chartName]) {
            const chart = this.charts[chartName];
            chart.data.datasets[0].data.push(value);
            
            // Limit data points
            if (chart.data.datasets[0].data.length > this.maxDataPoints) {
                chart.data.datasets[0].data.shift();
            }
            
            chart.update('none');
        }
    }

    updateChartDataset(chartName, datasetIndex, value) {
        if (this.charts[chartName]) {
            const chart = this.charts[chartName];
            chart.data.datasets[datasetIndex].data.push(value);
            
            // Limit data points
            if (chart.data.datasets[datasetIndex].data.length > this.maxDataPoints) {
                chart.data.datasets[datasetIndex].data.shift();
            }
            
            chart.update('none');
        }
    }
}

// Initialize charts when page loads
document.addEventListener('DOMContentLoaded', function() {
    const realCharts = new RealCharts();
    realCharts.initializeCharts();
    window.realCharts = realCharts;
});
