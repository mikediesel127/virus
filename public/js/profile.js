// Manages user profile actions such as viewing and editing profiles
$(document).ready(function() {
    $('#profile-edit-form').on('submit', handleProfileEdit);
    $(document).on('click', '.profile-link', function(e) {
        e.preventDefault();
        var userId = $(this).data('userId');
        loadUserProfile(userId);
    });

// This function is called when a profile link is clicked
function loadUserProfile(userId) {
  // Use AJAX to fetch the profile data
  $.ajax({
    url: `/api/user/${userId}`,
    type: 'GET',
    success: function(data) {
      // Update the URL
      history.pushState(null, null, `/user/${userId}`);

      // Update the profile section with the new data
      updateProfileSection(data);

      // You can also update the document title
      document.title = `${data.username}'s Profile`;
    },
    error: function(error) {
      console.error('Error fetching profile:', error);
    }
  });
}

// This function updates the profile section of the page
function updateProfileSection(userData) {
  // Construct the new profile HTML using the userData
  var profileHtml = `
    <div class="profile-header">
      <img src="${userData.profilePicture}" alt="Profile Picture" class="profile-pic">
      <h3 class="username">${userData.username}</h3>
      <!-- ... other profile info ... -->
    </div>
    <!-- ... Add more profile details ... -->
  `;

  // Replace the existing profile section with the new HTML
  $('#user-profile').html(profileHtml);

  // If you have a posts section, update that as well
  updatePostsSection(userData.posts);
}

    function handleProfileEdit(event) {
        event.preventDefault();
        // Replace with actual profile edit logic
    }
});