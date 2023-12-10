$(document).on('click', '#show-register', toggleForms);
$(document).on('click', '#show-login', toggleForms);
$('#login-form').on('submit', handleLoginForm);
$('#register-form').on('submit', handleRegisterForm);
$(document).on('click', '#logout-button', logout);
// ... All other event bindings ...
