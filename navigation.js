// navigation.js - Page navigation and routing
function showPage(pageId) {
    console.log('🔄 Switching to page:', pageId);
    
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Remove active class from all nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Show selected page and activate nav link
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
        event.target.classList.add('active');
        console.log('✅ Page activated:', pageId);
    } else {
        console.error('❌ Page not found:', pageId);
    }
    
    // Update time display for active page
    updatePageTime(pageId);
}

function updatePageTime(pageId) {
    const timeElement = document.getElementById(pageId + 'Time');
    if (timeElement) {
        timeElement.textContent = new Date().toLocaleTimeString();
    }
}

// Add event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('📍 Navigation initialized');
    
    // Add click listeners to all nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const pageId = this.getAttribute('onclick').match(/'([^']+)'/)[1];
            showPage(pageId);
        });
    });
    
    // Initialize first page
    showPage('dashboard');
});

// Global function for buttons
function sendUpperLayerCommand(command) {
    if (window.mqttManager) {
        window.mqttManager.sendUpperLayerCommand(command);
    } else {
        alert('MQTT not connected');
    }
}

function sendLowerLayerCommand(command) {
    if (window.mqttManager) {
        window.mqttManager.sendLowerLayerCommand(command);
    } else {
        alert('MQTT not connected');
    }
}
