// charts.js - Chart initialization and real-time updates
class ChartManager {
    constructor() {
        this.charts = {};
        this.realTimeData = {
            performance: [],
            efficiency: [],
            safety: [],
            production: []
        };
    }

    initializeCharts() {
        this.initializePerformanceChart();
        this.initializeCostChart();
        this.initializeElectrolyzerCharts();
        this.initializeAnalyticsCharts();
        
        console.log('📊 All charts initialized');
    }

    initializePerformanceChart() {
        const ctx = document.getElementById('performanceChart').getContext('2d');
        this.charts.performanceChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: Array.from({length: 8}, (_, i) => `Day ${i+1}`),
                datasets: [
                    {
                        label: 'HE-NMPC',
                        data: [82, 85, 88, 90, 92, 93, 94, 94],
                        borderColor: '#3b82f6',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        tension: 0.4,
                        borderWidth: 3,
                        fill: true
                    },
                    {
                        label: 'Stochastic MPC',
                        data: [80, 82, 84, 85, 86, 86, 87, 87],
                        borderColor: '#10b981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        tension: 0.4,
                        borderWidth: 2
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'top' }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        min: 70,
                        max: 100,
                        grid: { color: 'rgba(255,255,255,0.1)' },
                        ticks: { color: '#94a3b8' }
                    },
                    x: {
                        grid: { color: 'rgba(255,255,255,0.1)' },
                        ticks: { color: '#94a3b8' }
                    }
                }
            }
        });
    }

    initializeCostChart() {
        const ctx = document.getElementById('costChart').getContext('2d');
        this.charts.costChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['HE-NMPC', 'Stochastic MPC', 'Mixed-Integer MPC', 'Standard MPC'],
                datasets: [{
                    data: [142, 168, 185, 210],
                    backgroundColor: [
                        'rgba(59, 130, 246, 0.8)',
                        'rgba(16, 185, 129, 0.8)',
                        'rgba(245, 158, 11, 0.8)',
                        'rgba(100, 116, 139, 0.8)'
                    ],
                    borderColor: [
                        'rgb(59, 130, 246)',
                        'rgb(16, 185, 129)',
                        'rgb(245, 158, 11)',
                        'rgb(100, 116, 139)'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { color: '#94a3b8' }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `Daily Cost: $${context.raw}`;
                            }
                        }
                    }
                }
            }
        });
    }

    initializeElectrolyzerCharts() {
        // Electrolyzer Performance Chart
        const electrolyzerCtx = document.getElementById('electrolyzerChart').getContext('2d');
        this.charts.electrolyzerChart = new Chart(electrolyzerCtx, {
            type: 'line',
            data: {
                labels: Array.from({length: 24}, (_, i) => `${i}:00`),
                datasets: [
                    {
                        label: 'Efficiency (%)',
                        data: Array.from({length: 24}, () => Math.random() * 10 + 70),
                        borderColor: '#3b82f6',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        tension: 0.4,
                        borderWidth: 2,
                        yAxisID: 'y'
                    },
                    {
                        label: 'Stack Temperature (°C)',
                        data: Array.from({length: 24}, () => Math.random() * 10 + 60),
                        borderColor: '#ef4444',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        tension: 0.4,
                        borderWidth: 2,
                        yAxisID: 'y1'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        grid: { color: 'rgba(255,255,255,0.1)' },
                        ticks: { color: '#94a3b8' },
                        title: {
                            display: true,
                            text: 'Efficiency (%)',
                            color: '#94a3b8'
                        }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        grid: { drawOnChartArea: false },
                        ticks: { color: '#94a3b8' },
                        title: {
                            display: true,
                            text: 'Temperature (°C)',
                            color: '#94a3b8'
                        }
                    },
                    x: {
                        grid: { color: 'rgba(255,255,255,0.1)' },
                        ticks: { color: '#94a3b8' }
                    }
                }
            }
        });

        // Gas Production Chart
        const gasCtx = document.getElementById('gasProductionChart').getContext('2d');
        this.charts.gasProductionChart = new Chart(gasCtx, {
            type: 'bar',
            data: {
                labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
                datasets: [
                    {
                        label: 'Oxygen Production (L/min)',
                        data: [42, 45, 48, 52, 50, 46],
                        backgroundColor: 'rgba(59, 130, 246, 0.7)',
                        borderColor: 'rgb(59, 130, 246)',
                        borderWidth: 1
                    },
                    {
                        label: 'Hydrogen Production (L/min)',
                        data: [21, 22.5, 24, 26, 25, 23],
                        backgroundColor: 'rgba(245, 158, 11, 0.7)',
                        borderColor: 'rgb(245, 158, 11)',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: 'rgba(255,255,255,0.1)' },
                        ticks: { color: '#94a3b8' },
                        title: {
                            display: true,
                            text: 'Production Rate (L/min)',
                            color: '#94a3b8'
                        }
                    },
                    x: {
                        grid: { color: 'rgba(255,255,255,0.1)' },
                        ticks: { color: '#94a3b8' }
                    }
                }
            }
        });
    }

    initializeAnalyticsCharts() {
        // Economic Performance Chart
        const economicCtx = document.getElementById('economicChart').getContext('2d');
        this.charts.economicChart = new Chart(economicCtx, {
            type: 'bar',
            data: {
                labels: ['HE-NMPC', 'Stochastic MPC', 'Mixed-Integer MPC', 'Standard MPC'],
                datasets: [
                    {
                        label: 'Cost Savings (%)',
                        data: [28, 20, 12, 0],
                        backgroundColor: 'rgba(59, 130, 246, 0.8)',
                        borderColor: 'rgb(59, 130, 246)',
                        borderWidth: 1
                    },
                    {
                        label: 'PV Utilization (%)',
                        data: [92, 85, 78, 72],
                        backgroundColor: 'rgba(16, 185, 129, 0.8)',
                        borderColor: 'rgb(16, 185, 129)',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        grid: { color: 'rgba(255,255,255,0.1)' },
                        ticks: { color: '#94a3b8' },
                        title: {
                            display: true,
                            text: 'Performance (%)',
                            color: '#94a3b8'
                        }
                    },
                    x: {
                        grid: { color: 'rgba(255,255,255,0.1)' },
                        ticks: { color: '#94a3b8' }
                    }
                }
            }
        });

        // Safety Chart
        const safetyCtx = document.getElementById('safetyChart').getContext('2d');
        this.charts.safetyChart = new Chart(safetyCtx, {
            type: 'radar',
            data: {
                labels: ['Oxygen Purity', 'Pressure Limits', 'Temperature', 'Gas Leaks', 'Emergency Response'],
                datasets: [
                    {
                        label: 'HE-NMPC',
                        data: [95, 98, 92, 96, 94],
                        backgroundColor: 'rgba(59, 130, 246, 0.2)',
                        borderColor: 'rgb(59, 130, 246)',
                        pointBackgroundColor: 'rgb(59, 130, 246)',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: 'rgb(59, 130, 246)'
                    },
                    {
                        label: 'Standard MPC',
                        data: [82, 85, 78, 80, 76],
                        backgroundColor: 'rgba(100, 116, 139, 0.2)',
                        borderColor: 'rgb(100, 116, 139)',
                        pointBackgroundColor: 'rgb(100, 116, 139)',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: 'rgb(100, 116, 139)'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        angleLines: { color: 'rgba(255,255,255,0.1)' },
                        grid: { color: 'rgba(255,255,255,0.1)' },
                        pointLabels: { color: '#94a3b8' },
                        ticks: { color: '#94a3b8', backdropColor: 'transparent' },
                        suggestedMin: 50,
                        suggestedMax: 100
                    }
                }
            }
        });
    }

    updateChartsWithRealTimeData(data) {
        // Update performance chart with new data
        if (this.charts.performanceChart) {
            const chart = this.charts.performanceChart;
            
            // Add new data point
            chart.data.labels.push(new Date().toLocaleTimeString());
            chart.data.datasets[0].data.push(data.performance || 90 + Math.random() * 4);
            chart.data.datasets[1].data.push(data.performance ? data.performance - 5 : 85 + Math.random() * 4);
            
            // Keep only last 15 data points
            if (chart.data.labels.length > 15) {
                chart.data.labels.shift();
                chart.data.datasets.forEach(dataset => dataset.data.shift());
            }
            
            chart.update('none');
        }

        // Update other charts similarly
        this.updateEfficiencyChart(data.efficiency);
        this.updateSafetyChart(data.safetyMargin);
    }

    updateEfficiencyChart(efficiency) {
        if (this.charts.electrolyzerChart && efficiency) {
            const chart = this.charts.electrolyzerChart;
            
            // Shift data and add new point
            chart.data.datasets[0].data.shift();
            chart.data.datasets[0].data.push(efficiency);
            
            // Update temperature with some correlation
            chart.data.datasets[1].data.shift();
            chart.data.datasets[1].data.push(60 + (efficiency - 75) * 0.3 + Math.random() * 2);
            
            chart.update('none');
        }
    }

    updateSafetyChart(safetyMargin) {
        if (this.charts.safetyChart && safetyMargin) {
            // Update radar chart with new safety data
            const newData = [
                Math.min(100, safetyMargin + 5),
                Math.min(100, safetyMargin + 8),
                Math.min(100, safetyMargin + 2),
                Math.min(100, safetyMargin + 6),
                Math.min(100, safetyMargin + 4)
            ];
            
            this.charts.safetyChart.data.datasets[0].data = newData;
            this.charts.safetyChart.update('none');
        }
    }

    addDataPoint(chartName, datasetIndex, value) {
        if (this.charts[chartName]) {
            const chart = this.charts[chartName];
            chart.data.datasets[datasetIndex].data.push(value);
            
            if (chart.data.labels.length > 20) {
                chart.data.labels.shift();
                chart.data.datasets.forEach(dataset => dataset.data.shift());
            }
            
            chart.update('none');
        }
    }
}

// Initialize chart manager
window.chartManager = new ChartManager();