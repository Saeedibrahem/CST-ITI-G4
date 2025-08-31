// Render navbar when page loads
document.addEventListener('DOMContentLoaded', function () {
    if (window.sharedUtils && window.sharedUtils.renderNavbar) {
        window.sharedUtils.renderNavbar();
    }
});