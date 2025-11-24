// charts.js - Complete Chart Implementation for HE-NMPC Dashboard
console.log('📊 charts.js loaded - Initializing all dashboard charts');

class DashboardCharts {
    constructor() {
        this.charts = {};
        this.initialized = false;
    }

    initializeAllCharts() {
        if (this.initialized) return;
        
        console.log('🎨 Initializing all dashboard charts...');
        
        try {
            // Performance Comparison Chart
            this.initializePerformanceChart();
            
            // Cost Distribution Chart
            this.initializeCostChart();
            
            // Electrolyzer Performance Chart
            this.initializeElectrolyzerChart();
            
            // Gas Production Chart
            this.initializeGasProductionChart();
            
            // Economic Performance Chart
            this.initializeEconomicChart();
            
            // Safety Chart
            this.initializeSafetyChart();
            
            // Computational Performance Chart
            this.initializeComputationalChart();
            
            // Training Performance Chart
            this.initializeTrainingChart();
            
            // Cost Breakdown Chart
            this.initializeCostBreakdownChart();
            
            // Savings Chart
            this.initializeSavingsChart();
            
            // ROI Chart
            this.initializeROIChart();
            
            // Safety Margin Chart
            this.initializeSafetyMarginChart();
            
            this.initialized = true;
            console.log('✅ All charts initialized successfully');
            
        } catch (error) {
            console.error('❌ Chart initialization error:', error);
        }
    }

    // Performance Comparison Over Time
    initializePerformanceChart() {
        const ctx = document.getElementById('performanceChart');
        if (!ctx) return;

        this.charts.performance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
                datasets: [
                    {
                        label: 'HE-NMPC',
                        data: [88, 92, 94, 96, 93, 90],
                        borderColor: '#4a90e2',
                        backgroundColor: 'rgba(74, 144, 226, 0.1)',
                        borderWidth: 3,
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'Stochastic MPC',
                        data: [82, 85, 87, 86, 84, 82],
                        borderColor: '#e2b04a',
                        backgroundColor: 'rgba(226, 176, 74, 0.1)',
                        borderWidth: 2,
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'Standard MPC',
                        data: [72, 75, 76, 78, 76, 74],
                        borderColor: '#dc3545',
                        backgroundColor: 'rgba(220, 53, 69, 0.1)',
                        borderWidth: 2,
                        tension: 0.4,
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'MPC Performance Over 24 Hours',
                        color: '#ffffff',
                        font: { size: 14, weight: 'bold' }
                    },
                    legend: {
                        labels: { color: '#b0b0b0' }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        min: 60,
                        max: 100,
                        grid: { color: 'rgba(255, 255, 255, 0.1)' },
                        ticks: { color: '#b0b0b0' },
                        title: {
                            display: true,
                            text: 'Performance Score (%)',
                            color: '#b0b0b0'
                        }
                    },
                    x: {
                        grid: { color: 'rgba(255, 255, 255, 0.1)' },
                        ticks: { color: '#b0b0b0' }
                    }
                }
            }
        });
    }

    // Cost Distribution Analysis
    initializeCostChart() {
        const ctx = document.getElementById('costChart');
        if (!ctx) return;

        this.charts.cost = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['HE-NMPC', 'Stochastic', 'Mixed-Integer', 'Standard'],
                datasets: [{
                    label: 'Levelized Cost ($/kg O₂)',
                    data: [142, 168, 185, 210],
                    backgroundColor: [
                        'rgba(74, 144, 226, 0.8)',
                        'rgba(226, 176, 74, 0.8)',
                        'rgba(103, 178, 111, 0.8)',
                        'rgba(220, 53, 69, 0.8)'
                    ],
                    borderColor: [
                        '#4a90e2',
                        '#e2b04a',
                        '#67b26f',
                        '#dc3545'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Cost Comparison Across MPC Methods',
                        color: '#ffffff',
                        font: { size: 14, weight: 'bold' }
                    },
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: 'rgba(255, 255, 255, 0.1)' },
                        ticks: { color: '#b0b0b0' },
                        title: {
                            display: true,
                            text: 'Cost ($/kg O₂)',
                            color: '#b0b0b0'
                        }
                    },
                    x: {
                        grid: { color: 'rgba(255, 255, 255, 0.1)' },
                        ticks: { color: '#b0b0b0' }
                    }
                }
            }
        });
    }

    // Electrolyzer Performance Metrics
    initializeElectrolyzerChart() {
        const ctx = document.getElementById('electrolyzerChart');
        if (!ctx) return;

        this.charts.electrolyzer = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'],
                datasets: [
                    {
                        label: 'Efficiency (%)',
                        data: [75, 76, 77, 78, 80, 82, 84, 83, 81, 79, 77, 76],
                        borderColor: '#4a90e2',
                        backgroundColor: 'rgba(74, 144, 226, 0.1)',
                        borderWidth: 2,
                        yAxisID: 'y',
                        tension: 0.4
                    },
                    {
                        label: 'Production Rate (%)',
                        data: [65, 68, 70, 72, 75, 78, 82, 85, 82, 78, 72, 68],
                        borderColor: '#67b26f',
                        backgroundColor: 'rgba(103, 178, 111, 0.1)',
                        borderWidth: 2,
                        yAxisID: 'y',
                        tension: 0.4
                    },
                    {
                        label: 'Stack Temp (°C)',
                        data: [62, 63, 64, 65, 67, 69, 71, 72, 70, 68, 66, 64],
                        borderColor: '#e2b04a',
                        backgroundColor: 'rgba(226, 176, 74, 0.1)',
                        borderWidth: 2,
                        yAxisID: 'y1',
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'Electrolyzer Performance Metrics',
                        color: '#ffffff',
                        font: { size: 14, weight: 'bold' }
                    },
                    legend: {
                        labels: { color: '#b0b0b0' }
                    }
                },
                scales: {
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        grid: { color: 'rgba(255, 255, 255, 0.1)' },
                        ticks: { color: '#b0b0b0' },
                        title: {
                            display: true,
                            text: 'Efficiency/Production (%)',
                            color: '#b0b0b0'
                        }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        grid: { drawOnChartArea: false },
                        ticks: { color: '#e2b04a' },
                        title: {
                            display: true,
                            text: 'Temperature (°C)',
                            color: '#e2b04a'
                        }
                    },
                    x: {
                        grid: { color: 'rgba(255, 255, 255, 0.1)' },
                        ticks: { color: '#b0b0b0' }
                    }
                }
            }
        });
    }

    // Gas Production Rates
    initializeGasProductionChart() {
        const ctx = document.getElementById('gasProductionChart');
        if (!ctx) return;

        this.charts.gasProduction = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
                datasets: [
                    {
                        label: 'Oxygen (L/min)',
                        data: [35, 38, 42, 45, 43, 40],
                        backgroundColor: 'rgba(74, 144, 226, 0.8)',
                        borderColor: '#4a90e2',
                        borderWidth: 1
                    },
                    {
                        label: 'Hydrogen (L/min)',
                        data: [18, 20, 22, 24, 23, 21],
                        backgroundColor: 'rgba(103, 178, 111, 0.8)',
                        borderColor: '#67b26f',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Gas Production Rates',
                        color: '#ffffff',
                        font: { size: 14, weight: 'bold' }
                    },
                    legend: {
                        labels: { color: '#b0b0b0' }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: 'rgba(255, 255, 255, 0.1)' },
                        ticks: { color: '#b0b0b0' },
                        title: {
                            display: true,
                            text: 'Production Rate (L/min)',
                            color: '#b0b0b0'
                        }
                    },
                    x: {
                        grid: { color: 'rgba(255, 255, 255, 0.1)' },
                        ticks: { color: '#b0b0b0' }
                    }
                }
            }
        });
    }

    // Economic Performance Comparison
    initializeEconomicChart() {
        const ctx = document.getElementById('economicChart');
        if (!ctx) return;

        this.charts.economic = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['Cost Efficiency', 'PV Utilization', 'O₂ Availability', 'Grid Optimization', 'H₂ Valorization', 'Operational Cost'],
                datasets: [
                    {
                        label: 'HE-NMPC',
                        data: [95, 92, 96, 94, 88, 93],
                        backgroundColor: 'rgba(74, 144, 226, 0.2)',
                        borderColor: '#4a90e2',
                        borderWidth: 2,
                        pointBackgroundColor: '#4a90e2'
                    },
                    {
                        label: 'Stochastic MPC',
                        data: [85, 82, 88, 86, 78, 84],
                        backgroundColor: 'rgba(226, 176, 74, 0.2)',
                        borderColor: '#e2b04a',
                        borderWidth: 2,
                        pointBackgroundColor: '#e2b04a'
                    },
                    {
                        label: 'Standard MPC',
                        data: [72, 75, 82, 78, 65, 76],
                        backgroundColor: 'rgba(220, 53, 69, 0.2)',
                        borderColor: '#dc3545',
                        borderWidth: 2,
                        pointBackgroundColor: '#dc3545'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Economic Performance Comparison',
                        color: '#ffffff',
                        font: { size: 14, weight: 'bold' }
                    },
                    legend: {
                        labels: { color: '#b0b0b0' }
                    }
                },
                scales: {
                    r: {
                        angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' },
                        pointLabels: { color: '#b0b0b0' },
                        ticks: {
                            backdropColor: 'rgba(13, 25, 43, 0.8)',
                            color: '#b0b0b0',
                            showLabelBackdrop: false
                        },
                        min: 50,
                        max: 100
                    }
                }
            }
        });
    }

    // Safety Constraint Violations
    initializeSafetyChart() {
        const ctx = document.getElementById('safetyChart');
        if (!ctx) return;

        this.charts.safety = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['No Violations', 'Minor Violations', 'Major Violations'],
                datasets: [{
                    data: [94, 4, 2],
                    backgroundColor: [
                        'rgba(103, 178, 111, 0.8)',
                        'rgba(226, 176, 74, 0.8)',
                        'rgba(220, 53, 69, 0.8)'
                    ],
                    borderColor: [
                        '#67b26f',
                        '#e2b04a',
                        '#dc3545'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Safety Constraint Violations Distribution',
                        color: '#ffffff',
                        font: { size: 14, weight: 'bold' }
                    },
                    legend: {
                        position: 'bottom',
                        labels: { color: '#b0b0b0' }
                    }
                }
            }
        });
    }

    // Computational Performance
    initializeComputationalChart() {
        const ctx = document.getElementById('computationalChart');
        if (!ctx) return;

        this.charts.computational = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['HE-NMPC', 'Stochastic MPC', 'Mixed-Integer MPC', 'Standard MPC'],
                datasets: [{
                    label: 'Computation Time (ms)',
                    data: [45, 120, 280, 85],
                    backgroundColor: [
                        'rgba(74, 144, 226, 0.8)',
                        'rgba(226, 176, 74, 0.8)',
                        'rgba(103, 178, 111, 0.8)',
                        'rgba(220, 53, 69, 0.8)'
                    ],
                    borderColor: [
                        '#4a90e2',
                        '#e2b04a',
                        '#67b26f',
                        '#dc3545'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Computational Performance Comparison',
                        color: '#ffffff',
                        font: { size: 14, weight: 'bold' }
                    },
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: 'rgba(255, 255, 255, 0.1)' },
                        ticks: { color: '#b0b0b0' },
                        title: {
                            display: true,
                            text: 'Computation Time (ms)',
                            color: '#b0b0b0'
                        }
                    },
                    x: {
                        grid: { color: 'rgba(255, 255, 255, 0.1)' },
                        ticks: { color: '#b0b0b0' }
                    }
                }
            }
        });
    }

    // Training Performance
    initializeTrainingChart() {
        const ctx = document.getElementById('trainingChart');
        if (!ctx) return;

        this.charts.training = new Chart(ctx, {
            type: 'line',
            data: {
                labels: Array.from({length: 150}, (_, i) => i + 1),
                datasets: [
                    {
                        label: 'Training Loss',
                        data: Array.from({length: 150}, (_, i) => 0.5 * Math.exp(-i/30) + 0.02 + Math.random() * 0.01),
                        borderColor: '#e2b04a',
                        backgroundColor: 'rgba(226, 176, 74, 0.1)',
                        borderWidth: 2,
                        tension: 0.4,
                        yAxisID: 'y'
                    },
                    {
                        label: 'Validation Accuracy',
                        data: Array.from({length: 150}, (_, i) => 0.7 + 0.3 * (1 - Math.exp(-i/40)) + Math.random() * 0.02),
                        borderColor: '#4a90e2',
                        backgroundColor: 'rgba(74, 144, 226, 0.1)',
                        borderWidth: 2,
                        tension: 0.4,
                        yAxisID: 'y1'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Neural Network Training Performance',
                        color: '#ffffff',
                        font: { size: 14, weight: 'bold' }
                    },
                    legend: {
                        labels: { color: '#b0b0b0' }
                    }
                },
                scales: {
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        grid: { color: 'rgba(255, 255, 255, 0.1)' },
                        ticks: { color: '#e2b04a' },
                        title: {
                            display: true,
                            text: 'Training Loss',
                            color: '#e2b04a'
                        }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        grid: { drawOnChartArea: false },
                        ticks: { color: '#4a90e2' },
                        title: {
                            display: true,
                            text: 'Validation Accuracy',
                            color: '#4a90e2'
                        },
                        min: 0,
                        max: 1
                    },
                    x: {
                        grid: { color: 'rgba(255, 255, 255, 0.1)' },
                        ticks: { color: '#b0b0b0' },
                        title: {
                            display: true,
                            text: 'Training Epochs',
                            color: '#b0b0b0'
                        }
                    }
                }
            }
        });
    }

    // Cost Breakdown Analysis
    initializeCostBreakdownChart() {
        const ctx = document.getElementById('costBreakdownChart');
        if (!ctx) return;

        this.charts.costBreakdown = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Electricity', 'Maintenance', 'Personnel', 'Equipment Depreciation', 'Infrastructure'],
                datasets: [{
                    data: [45, 15, 25, 10, 5],
                    backgroundColor: [
                        'rgba(74, 144, 226, 0.8)',
                        'rgba(226, 176, 74, 0.8)',
                        'rgba(103, 178, 111, 0.8)',
                        'rgba(156, 39, 176, 0.8)',
                        'rgba(33, 150, 243, 0.8)'
                    ],
                    borderColor: [
                        '#4a90e2',
                        '#e2b04a',
                        '#67b26f',
                        '#9c27b0',
                        '#2196f3'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Operational Cost Breakdown',
                        color: '#ffffff',
                        font: { size: 14, weight: 'bold' }
                    },
                    legend: {
                        position: 'bottom',
                        labels: { color: '#b0b0b0' }
                    }
                }
            }
        });
    }

    // Savings Over Time
    initializeSavingsChart() {
        const ctx = document.getElementById('savingsChart');
        if (!ctx) return;

        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        this.charts.savings = new Chart(ctx, {
            type: 'line',
            data: {
                labels: months,
                datasets: [
                    {
                        label: 'Monthly Savings ($)',
                        data: [12000, 14500, 16800, 19200, 21500, 23800, 26200, 28500, 30800, 33200, 35500, 37800],
                        borderColor: '#67b26f',
                        backgroundColor: 'rgba(103, 178, 111, 0.1)',
                        borderWidth: 3,
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'Cumulative Savings ($)',
                        data: [12000, 26500, 43300, 62500, 84000, 107800, 134000, 162500, 193300, 226500, 262000, 299800],
                        borderColor: '#4a90e2',
                        backgroundColor: 'rgba(74, 144, 226, 0.1)',
                        borderWidth: 2,
                        tension: 0.4,
                        fill: true,
                        yAxisID: 'y1'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Financial Savings Over Time',
                        color: '#ffffff',
                        font: { size: 14, weight: 'bold' }
                    },
                    legend: {
                        labels: { color: '#b0b0b0' }
                    }
                },
                scales: {
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        grid: { color: 'rgba(255, 255, 255, 0.1)' },
                        ticks: { color: '#67b26f' },
                        title: {
                            display: true,
                            text: 'Monthly Savings ($)',
                            color: '#67b26f'
                        }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        grid: { drawOnChartArea: false },
                        ticks: { color: '#4a90e2' },
                        title: {
                            display: true,
                            text: 'Cumulative Savings ($)',
                            color: '#4a90e2'
                        }
                    },
                    x: {
                        grid: { color: 'rgba(255, 255, 255, 0.1)' },
                        ticks: { color: '#b0b0b0' }
                    }
                }
            }
        });
    }

    // ROI Projection
    initializeROIChart() {
        const ctx = document.getElementById('roiChart');
        if (!ctx) return;

        const years = ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'];
        
        this.charts.roi = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: years,
                datasets: [
                    {
                        label: 'Cumulative ROI (%)',
                        data: [8, 18, 28, 35, 42],
                        backgroundColor: 'rgba(74, 144, 226, 0.8)',
                        borderColor: '#4a90e2',
                        borderWidth: 1
                    },
                    {
                        label: 'Annual ROI (%)',
                        data: [8, 10, 10, 7, 7],
                        backgroundColor: 'rgba(103, 178, 111, 0.8)',
                        borderColor: '#67b26f',
                        borderWidth: 1,
                        type: 'line',
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Return on Investment Projection',
                        color: '#ffffff',
                        font: { size: 14, weight: 'bold' }
                    },
                    legend: {
                        labels: { color: '#b0b0b0' }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: 'rgba(255, 255, 255, 0.1)' },
                        ticks: { color: '#b0b0b0' },
                        title: {
                            display: true,
                            text: 'ROI (%)',
                            color: '#b0b0b0'
                        }
                    },
                    x: {
                        grid: { color: 'rgba(255, 255, 255, 0.1)' },
                        ticks: { color: '#b0b0b0' }
                    }
                }
            }
        });
    }

    // Safety Margin Analysis
    initializeSafetyMarginChart() {
        const ctx = document.getElementById('safetyMarginChart');
        if (!ctx) return;

        this.charts.safetyMargin = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'],
                datasets: [
                    {
                        label: 'Temperature Margin (%)',
                        data: [35, 34, 33, 32, 30, 28, 26, 25, 27, 29, 31, 33],
                        borderColor: '#e2b04a',
                        backgroundColor: 'rgba(226, 176, 74, 0.1)',
                        borderWidth: 2,
                        tension: 0.4
                    },
                    {
                        label: 'Pressure Margin (%)',
                        data: [42, 41, 40, 39, 38, 37, 36, 35, 36, 37, 39, 41],
                        borderColor: '#4a90e2',
                        backgroundColor: 'rgba(74, 144, 226, 0.1)',
                        borderWidth: 2,
                        tension: 0.4
                    },
                    {
                        label: 'Purity Margin (%)',
                        data: [28, 27, 26, 25, 24, 23, 22, 21, 22, 23, 25, 27],
                        borderColor: '#67b26f',
                        backgroundColor: 'rgba(103, 178, 111, 0.1)',
                        borderWidth: 2,
                        tension: 0.4
                    },
                    {
                        label: 'Overall Safety Margin (%)',
                        data: [25, 24, 23, 22, 20, 18, 16, 15, 17, 19, 21, 23],
                        borderColor: '#dc3545',
                        backgroundColor: 'rgba(220, 53, 69, 0.1)',
                        borderWidth: 3,
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Safety Margin Analysis Over 24 Hours',
                        color: '#ffffff',
                        font: { size: 14, weight: 'bold' }
                    },
                    legend: {
                        labels: { color: '#b0b0b0' }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 50,
                        grid: { color: 'rgba(255, 255, 255, 0.1)' },
                        ticks: { color: '#b0b0b0' },
                        title: {
                            display: true,
                            text: 'Safety Margin (%)',
                            color: '#b0b0b0'
                        }
                    },
                    x: {
                        grid: { color: 'rgba(255, 255, 255, 0.1)' },
                        ticks: { color: '#b0b0b0' }
                    }
                }
            }
        });
    }

    // Update charts with real-time data
    updateChartsWithRealData(data) {
        if (!this.initialized) return;

        // Update performance chart with new data
        if (this.charts.performance && data.performance) {
            // Add new data point and remove oldest
            const newData = [...this.charts.performance.data.datasets[0].data.slice(1), data.performance];
            this.charts.performance.data.datasets[0].data = newData;
            this.charts.performance.update('none');
        }

        // Update efficiency in electrolyzer chart
        if (this.charts.electrolyzer && data.efficiency) {
            const newEfficiency = [...this.charts.electrolyzer.data.datasets[0].data.slice(1), data.efficiency];
            this.charts.electrolyzer.data.datasets[0].data = newEfficiency;
            this.charts.electrolyzer.update('none');
        }

        console.log('📈 Charts updated with real-time data');
    }

    // Destroy all charts (for page transitions)
    destroyAllCharts() {
        Object.values(this.charts).forEach(chart => {
            if (chart && typeof chart.destroy === 'function') {
                chart.destroy();
            }
        });
        this.charts = {};
        this.initialized = false;
    }
}

// Initialize charts when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.dashboardCharts = new DashboardCharts();
    
    // Initialize charts after a short delay to ensure DOM is ready
    setTimeout(() => {
        window.dashboardCharts.initializeAllCharts();
    }, 1000);

    console.log('🎯 Dashboard charts system ready');
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DashboardCharts;
}
