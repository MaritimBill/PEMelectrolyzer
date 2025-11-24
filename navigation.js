// navigation.js - WORKING VERSION FOR FLAT STRUCTURE
console.log('✅ navigation.js loaded');

// Global function for page navigation
window.showPage = function(pageId) {
    console.log('🔄 Switching to page:', pageId);
    
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Remove active from all nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Show target page
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
    }
    
    // Activate clicked nav link
    event.target.classList.add('active');
    
    // Update time display
    const timeElement = document.getElementById(pageId + 'Time');
    if (timeElement) {
        timeElement.textContent = new Date().toLocaleTimeString();
    }
    
    console.log('✅ Page activated:', pageId);
}

// Global functions for buttons
window.sendUpperLayerCommand = function(command) {
    console.log('🔧 Upper layer command:', command);
    alert('Upper Layer Command: ' + command + ' sent!');
};

window.sendLowerLayerCommand = function(command) {
    console.log('🔧 Lower layer command:', command);
    alert('Lower Layer Command: ' + command + ' sent!');
};

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 DOM loaded - initializing navigation');
    
    // Setup slider functionality
    const economicSlider = document.getElementById('economicSetpoint');
    if (economicSlider) {
        economicSlider.addEventListener('input', function(e) {
            const value = e.target.value + '%';
            document.getElementById('economicValue').textContent = value;
            console.log('🎚️ Economic slider:', value);
        });
    }
    
    // Setup safety slider
    const safetySlider = document.getElementById('safetySetpoint');
    if (safetySlider) {
        safetySlider.addEventListener('input', function(e) {
            const value = e.target.value + '%';
            document.getElementById('safetyValue').textContent = value;
            console.log('🎚️ Safety slider:', value);
        });
    }
    
    // Initialize time displays
    setInterval(() => {
        const now = new Date().toLocaleTimeString();
        document.querySelectorAll('.time-display').forEach(display => {
            if (display.textContent === '--:--:--') {
                display.textContent = now;
            }
        });
    }, 1000);
    
    console.log('✅ Navigation and controls initialized');
});
