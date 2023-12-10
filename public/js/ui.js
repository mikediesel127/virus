// Manages various UI interactions
$(document).ready(function() {
    $('#dark-mode-switch').on('change', toggleDarkMode);
    $(document).on('click', '.nav-item', handleNavigation);
    $(document).on('click', '.profile-pic', () => $('#profile-menu').toggle());

    function toggleDarkMode() {
        $('body').toggleClass('dark-mode');
    }

    function handleNavigation() {
        $('.nav-item').removeClass('active');
        $(this).addClass('active');
        const target = $(this).attr('href').substring(1);
        loadPageContent(target);
    }

    function loadPageContent(page) {
        // Replace with actual page content loading logic
    }
});