// navigation.js - Page navigation and routing
function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Remove active class from all nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Show selected page and activate nav link
    document.getElementById(pageId).classList.add('active');
    event.target.classList.add('active');
    
    // Update time display for active page
    updatePageTime(pageId);
    
    // Initialize charts for the page if they exist
    setTimeout(() => initializePageCharts(pageId), 100);
}

function updatePageTime(pageId) {
    const timeElement = document.getElementById(pageId + 'Time');
    if (timeElement) {
        timeElement.textContent = new Date().toLocaleTimeString();
    }
}

function initializePageCharts(pageId) {
    if (window.chartManager) {
        switch(pageId) {
            case 'dashboard':
                // Dashboard charts are already initialized
                break;
            case 'electrolyzer':
                if (!window.chartManager.charts.electrolyzerChart) {
                    window.chartManager.initializeElectrolyzerCharts();
                }
                break;
            case 'analytics':
                if (!window.chartManager.charts.economicChart) {
                    window.chartManager.initializeAnalyticsCharts();
                }
                break;
        }
    }
}

// Keyboard shortcuts for navigation
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey) {
        switch(e.key) {
            case '1':
                showPage('dashboard');
                break;
            case '2':
                showPage('electrolyzer');
                break;
            case '3':
                showPage('analytics');
                break;
            case '4':
                showPage('neural');
                break;
        }
    }
});

// Initialize first page
document.addEventListener('DOMContentLoaded', () => {
    showPage('dashboard');
});