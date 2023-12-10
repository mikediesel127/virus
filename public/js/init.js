$(document).ready(function() {
    // Check if the user is already logged in when the page loads
    if (isLoggedIn()) {
        // Hide the login form and show the logout button and profile section
        $('#login-form').hide();
        $('#logout-button').show();
        $('#user-profile').show();
        // Load the user profile
        // setUserProfile();
    } else {
        // Show the login form and hide the logout button and profile section
        $('#login-form').show();
        $('#logout-button').hide();
        $('#user-profile').hide();
    }

    // Initialize the default active tab
    $('.tab-link[data-post-type="text"]').click();

    // Call initial functions
    updateFeed();
    loadPosts();
});
