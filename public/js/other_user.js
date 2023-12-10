// JavaScript for sending friend request using event delegation
$(document).on('click', '#add-friend-btn', function() {
  // Extracting user ID from the current URL
  const urlParams = new URLSearchParams(window.location.search);
  const profileUserId = urlParams.get('userId');

  // Check if the profile user's ID is available
  if (!profileUserId) {
    console.error('Profile user ID not found in the URL');
    // Handle the error, show a message to the user, etc.
    return;
  }

  $.ajax({
    url: `/api/user/${profileUserId}/friend-request`,
    method: 'POST',
    success: function(response) {
      // Update UI to show friend request sent
      $('#add-friend-btn').text('Friend Request Sent');
      $('#add-friend-btn').prop('disabled', true);
    },
    error: function(error) {
      console.error('Error sending friend request:', error);
      // Handle error, show a message to the user, etc.
    }
  });
});