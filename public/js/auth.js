//auth.js
$(document).ready(function() {
    $('#login-form').on('submit', handleLoginForm);
    $('#register-form').on('submit', handleRegisterForm);
    $(document).on('click', '#logout-button', logout);

function handleLoginForm(event) {
    event.preventDefault();
    const username = $('#username').val();
    const password = $('#password').val();
    simulateLogin(username, password);
    window.location.href="/";
}

function handleRegisterForm(event) {
    event.preventDefault();
    const username = $('#new-username').val();
    const password = $('#new-password').val();
    registerUser(username, password);
}

function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    localStorage.removeItem('userID');
    window.location.href = '/logout';
}

function simulateLogin(username, password) {
    console.log('Attempting to log in with:', username, password); // Log the credentials being sent
    // Send the login data to the server
    $.ajax({
        url: '/api/login',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ username: username, password: password }),
        success: function(response) {
            console.log('Logged in:', response, username);
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('username', username);
            localStorage.setItem('userID', response.userID);

            // setUserProfile();
              // Hide the login form
  $('#login-form').hide();
   // Show the logout button and profile section
  $('#logout-button').show();
  $('#user-profile').show();
            // Redirect to the user's profile page or reload the current page
             // Redirect to the dashboard page
            // window.location.href = '/'; // Change '/dashboard' to the path of your dashboard page
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error('Error logging in:', textStatus, errorThrown);
        }
    });
}


function registerUser(username, password) {
    // Send the user data to the server
    $.ajax({
        url: '/api/user',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ username: username, password: password }),
        success: function(response) {
            console.log('User registered:', response);
            // Here you might want to automatically log the user in or redirect them to the login page
            // For example:
            // simulateLogin(username, password);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error('Error registering user:', textStatus, errorThrown);
            // Here you should handle errors, such as displaying a message to the user
        }
    });
}

});