$(document).ready(function() {
    // Initialization

    $(document).on('click', '#show-register', toggleForms);
    $(document).on('click', '#show-login', toggleForms);
    $('#login-form').on('submit', handleLoginForm);
    $('#register-form').on('submit', handleRegisterForm);
    $(document).on('click', '#logout-button', logout);
    $(document).on('click', '.profile-pic', () => $('#profile-menu').toggle());
    $(document).on('click', '.nav-item', handleNavigation);
    $('#dark-mode-switch').on('change', toggleDarkMode);
    $(document).on('click', '#submit-post', submitPost);
    $(document).on('click', '.like-btn', handleLike);
    $(document).on('click', '.comment-btn', handleComment);
    $(document).on('click', '.share-btn', handleShare);
    $(document).on('click', '.post', handlePostClick);
    $('#post-creation-form').on('submit', handlePostCreation);
    $('#profile-edit-form').on('submit', handleProfileEdit);
    $('#search-form').on('submit', handleSearch);
      // Toggle the additional options section
  $('#additional-options-btn').on('click', function() {
    $('#options-content').slideToggle(); // Use slideToggle for a nice animation
  });
  // Toggle search bar on clicking search icon
$('.search-toggle').click(function() {
  $('#search-bar').toggle();
  $('#search-input').focus();
});
//Delete post
$('#posts-container').on('click', '.delete-btn', function() {
  const postId = $(this).closest('.post').data('post-id');
  deletePost(postId);
});

// SET LOGIN PAGE
  // Check if the user is already logged in when the page loads
  if (localStorage.getItem('isLoggedIn') === 'true') {
    // Hide the login form
    $('#login-form').hide();
    // Show the logout button and profile section
    $('#logout-button').show();
    $('#user-profile').show();
    // Load the user profile
    // setUserProfile();
  } else {
    // Show the login form
    $('#login-form').show();
    // Hide the logout button and profile section
    $('#logout-button').hide();
    $('#user-profile').hide();
  }

function addNotificationToUI(notification) {
  const notificationsContainer = document.querySelector('.notification-content');
  const notificationElement = document.createElement('div');
  notificationElement.classList.add('notification-item');
  notificationElement.innerHTML = `
    <strong>${notification.type}</strong>: ${notification.message}
  `;
  notificationsContainer.appendChild(notificationElement);
}

// Event listeners for navbar links
$('.nav-item').click(function() {
  const viewName = $(this).attr('href').substring(1); // Remove the '#' from the href
  loadView(viewName);
});

// Event listener for search input using 'on' for dynamic content

$(document).on('input', '#search-input', function() {
  var query = $(this).val().trim();

  // Check if query is not empty
  if (query.length > 0) {
    // Make an AJAX call to your server's search endpoint
    $.ajax({
      url: '/api/search', // Your API endpoint for search
      type: 'GET',
      data: { 'q': query },
      success: function(data) {
        // Assuming 'data' is an array of search results
        if (data.length > 0) {
          var resultsHtml = '';
          data.forEach(function(item) {
            // Make sure to use 'item._id' if that's the field name in your database
            resultsHtml += `
              <div class="search-result-item" data-id="${item._id}">
                <img src="${item.profilePicture || 'default-profile-pic.jpg'}" alt="${item.username}" class="search-result-img">
                <span class="search-result-text">${item.username}</span>
              </div>
            `;
          });
          // Display the results
          $('#search-results').html(resultsHtml).addClass('visible');
        } else {
          // If there are no results, display a 'no results' message
          $('#search-results').html('<div class="search-result-item">No results found</div>').addClass('visible');
        }
      },
      error: function(err) {
        // Handle errors
        console.log('Error fetching search results:', err);
      }
    });
  } else {
    // If the query is empty, clear the results
    $('#search-results').empty().removeClass('visible');
  }
});

// Add click event delegation for search result items
$(document).on('click', '.search-result-item', function() {
  var userId = $(this).data('id'); // Retrieve the user ID
  if (userId) {

    window.location.href = `/user?userId=${userId}`; // Redirect with query parameter
  loadUserPosts(userId);
  }
});

// Hide search results when clicking outside
$(document).mouseup(function(e) {
  var container = $("#search-results");
  // If the target of the click isn't the container nor a descendant of the container
  if (!container.is(e.target) && container.has(e.target).length === 0) {
    container.removeClass('visible');
  }
});

// Hide search results when clicking outside
$(document).mouseup(function(e) {
  var container = $("#search-results");
  // If the target of the click isn't the container nor a descendant of the container
  if (!container.is(e.target) && container.has(e.target).length === 0) {
    container.removeClass('visible');
  }
});

// CLICK A LIVE POST SUGGESTION:
$(document).on('click', '.suggestion-item', function() {
  var suggestionText = $(this).text();
  $('#post-content').val(suggestionText); // Autofill the textarea with the suggestion
  $('#suggestions-container').hide();
});

// -----SIMILAR POSTS - ASYNC RESULTS----
$(document).on('input', '.post-box textarea', function() {
  var activePostBox = $(this).closest('.post-box');
  var inputContent = $(this).val();

  // Only proceed if inputContent has a certain number of characters
  if (inputContent.length >= 3) { // for example, start searching after 3 characters
    $.ajax({
      url: '/api/suggestions', // Your API endpoint for fetching suggestions
      type: 'GET',
      data: { content: inputContent },
      success: function(data) {
        var suggestionsContainer = activePostBox.find('#suggestions-container'); // Adjust the selector to your container
        suggestionsContainer.empty(); // Clear previous suggestions

        if (data.posts.length > 0 || data.users.length > 0) {
          data.posts.forEach(function(post) {
            suggestionsContainer.append($('<div class="suggestion-item">').text(post.content)); // Adjust how you want to display posts
          });
          data.users.forEach(function(user) {
            suggestionsContainer.append($('<div>').text(user.username)); // Adjust how you want to display users
          });
        } else {
          // suggestionsContainer.append($('<div>').text('No results found'));
        }

        suggestionsContainer.show(); // Make sure to display the container
      },
      error: function(err) {
        console.error('Error fetching suggestions:', err);
      }
    });
  } else {
    $('#suggestions-container').hide();
  }
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

// This function updates the posts section of the page
function updatePostsSection(postsData) {
  // Construct the new posts HTML using the postsData
  var postsHtml = '';
  postsData.forEach(function(post) {
    postsHtml += `
      <div class="post">
        <!-- ... Post Content ... -->
      </div>
    `;
  });

  // Replace the existing posts section with the new HTML
  $('#user-posts').html(postsHtml);
}

// Event listener for profile link clicks
$(document).on('click', '.profile-link', function(e) {
  e.preventDefault();
  var userId = $(this).data('userId');
  loadUserProfile(userId);
});

// ---------POST CATEGORY--------
// Toggle category input when 'Add Category' button is clicked
$('#add-category-btn').click(function() {
  $('#category-search-container').toggle();
});

// Handle live category search
$('#category-search').on('input', function() {
  var searchTerm = $(this).val().trim();
  if (searchTerm.length > 0) {
    // Perform AJAX call to search for categories
    $.ajax({
      url: '/api/categories/search', // Your API endpoint for category search
      type: 'GET',
      data: { term: searchTerm },
      success: function(data) {
        var resultsContainer = $('#category-results');
        resultsContainer.empty(); // Clear previous results

        if (data.length > 0) {
          data.forEach(function(category) {
            resultsContainer.append($('<div>').text(category.name)); // Adjust to display categories
          });
          resultsContainer.show();
        } else {
          resultsContainer.hide();
        }
      },
      error: function(err) {
        console.error('Error fetching categories:', err);
      }
    });
  } else {
    $('#category-results').hide();
  }
});

    // // Functions
    // function initializeApp() {
    //     if (isLoggedIn()) {
    //         // setUserProfile();
    //         loadMainFeed();
    //     } else {
    //         showAuthForm();
    //     }
    //     initializeSwiper();
    //     initializeLozad();

    // }

    function isLoggedIn() {
        return localStorage.getItem('isLoggedIn') === 'true';
    }


    function showAuthForm() {
        $('#auth-container').show();
        $('#user-profile').hide();
        $('#main-feed').hide();
    }

    function toggleForms() {
        $('#login-form, #register-form').toggle();
    }

function handleRegisterForm(event) {
    event.preventDefault();
    const username = $('#new-username').val();
    // const email = $('#email').val();
    const password = $('#new-password').val();
    registerUser(username, password);
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

function handleLoginForm(event) {
    event.preventDefault();
    const username = $('#username').val();
    const password = $('#password').val();
    simulateLogin(username, password);
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

function setUserProfile() {
    var userID = localStorage.getItem('userID');
    if (userID) {
        $.ajax({
            url: '/api/user/' + userID,
            method: 'GET',
            success: function(response) {
                console.log('User profile data:', response);
                // Update the profile section with the fetched data
                // Make sure to update the path to the actual profile picture
                const userProfileHtml = `
                  <div class="profile-header">
                    <img src="default-profile-pic.jpg" alt="Profile Picture" class="profile-pic">
                    <h3 class="username">${response.username}</h3>
                    <p class="bio">This is a short bio...</p>
                    <button class="edit-profile-btn">Edit Profile</button>
                  </div>
                  <div class="profile-stats">
                    <div class="stat-tile">
                      <span class="stat-number" id="posts-count">120</span>
                      <span class="stat-label">Posts</span>
                    </div>
                    <div class="stat-tile">
                      <span class="stat-number" id="comments-count">450</span>
                      <span class="stat-label">Comments</span>
                    </div>
                    <div class="stat-tile">
                      <span class="stat-number" id="points-count">1520</span>
                      <span class="stat-label">Points</span>
                    </div>
                    <div class="stat-tile">
                      <span class="stat-number" id="creations-count">5</span>
                      <span class="stat-label">Creations</span>
                    </div>
                  </div>
                  <div class="profile-details">
                    <p><strong>Interests:</strong> <span class="interests">Technology, Science, Art</span></p>
                    <p><strong>Friends:</strong> <span class="friend-count">120</span></p>
                  </div>
                `;
                $('#user-profile').html(userProfileHtml);
                // Here you would also update the statistics with real data from the response
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.error('Error fetching user profile:', textStatus, errorThrown);
            }
        });
    } else {
        console.error('No user ID found in localStorage.');
    }
}



function logout() {
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('username');
  localStorage.removeItem('userID');

   // Redirect to the logout route
  window.location.href = '/logout';
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

    function toggleDarkMode() {
        $('body').toggleClass('dark-mode');
    }

    function handleLike(event) {
        // Replace with actual like logic
    }

    function handleComment(event) {
        // Replace with actual comment logic
    }

    function handleShare(event) {
        // Replace with actual share logic
    }

    function handlePostClick(event) {
        // Replace with actual post click logic
    }

    function handlePostCreation(event) {
        event.preventDefault();
        const content = $('#post-content').val();
        // Add other post properties like privacy, type, widgets, points
        createPost(content);
    }

    function handleProfileEdit(event) {
        event.preventDefault();
        // Replace with actual profile edit logic
    }

    function handleSearch(event) {
        event.preventDefault();
        // Replace with actual search logic
    }

    function initializeSwiper() {
        // Replace with actual Swiper initialization
    }

    function initializeLozad() {
        // Replace with actual Lozad initialization
    }

    function loadMainFeed() {
        // Replace with actual main feed loading logic
    }

    function updateFeed() {
        // Replace with actual feed update logic
    }

    function loadPosts() {
        console.log('Loading posts...');
        // Replace '/api/posts' with your actual API endpoint
        $.ajax({
            url: '/api/posts',
            method: 'GET',
            success: function(posts) {
                console.log('Posts loaded:', posts);
                const postsContainer = $('#posts-container');
                postsContainer.empty(); // Clear the posts container
                posts.forEach(addPostToUI);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.error('Error loading posts:', textStatus, errorThrown);
            }
        });
    }

function addPostToUI(post) {
// Check if the user object and profilePicture exist
  const userProfilePicture = post.user && post.user.profilePicture ? post.user.profilePicture : 'default-profile-pic.jpg';
  const username = post.user ? post.user.username : "Unknown"; // Fallback for username
  const postDate = new Date(post.createdAt).toLocaleString(); // Format the date

  const postHtml = `
    <div class="post" data-post-id="${post._id}">
      <div class="post-header">
        <img src="${userProfilePicture}" alt="${username}'s profile picture" class="profile-pic">
        <div class="post-info">
          <span class="username">${username}</span>
          <span class="date">${postDate}</span>
        </div>
      </div>
      <div class="post-content">
        <p>${post.content}</p>
      </div>
      <div class="post-actions">
        <button class="like-btn"><i class="fas fa-heart"></i></button>
        <button class="comment-btn"><i class="fas fa-comment"></i></button>
        <button class="share-btn"><i class="fas fa-share"></i></button>
        <button class="delete-btn" title="Delete Post"><i class="fas fa-trash"></i></button>
      </div>
      <div class="post-comments" id="comments-${post._id}" style="display: none;">
        <!-- Comments will be loaded here -->
      </div>
    </div>
  `;
  $('#posts-container').append(postHtml);
}

// -------TABS------
  // Click event for each tab
  $('.tab-link').click(function() {
    var postType = $(this).data('post-type');

    // Hide all post boxes
    $('.post-box').hide();

    // Show the selected post type box
    $('#post-box-' + postType).show();

    // Update active tab
    $('.tab-link').removeClass('active');
    $(this).addClass('active');
  });

  // Initialize the default active tab
  $('.tab-link[data-post-type="text"]').click();

function deletePost(postId) {
  // Confirm before deleting
  if (confirm('Are you sure you want to delete this post?')) {
    $.ajax({
      url: `/api/posts/${postId}`,
      method: 'DELETE',
      success: function(response) {
        // Remove the post element from the UI
        $(`div[data-post-id="${postId}"]`).remove();
        console.log('Post deleted successfully:', response);
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.error('Error deleting post:', textStatus, errorThrown);
      }
    });
  }
}
    function createPost(content) {
        // Replace with actual post creation logic
        console.log('Creating post:', content);
        // Replace '/api/posts' with your actual API endpoint
        $.ajax({
            url: '/api/posts',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ content: content }),
            success: function(response) {
                console.log('Post created:', response);
                $('#post-content').val(''); // Clear the textarea
                loadPosts(); // Reload the posts
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.error('Error creating post:', textStatus, errorThrown);
            }
        });
    }

      // Define the submitPost function
  function submitPost() {
    // Collect post data
    const content = $('#post-content').val();
    const privacy = $('input[name="privacy"]:checked').val();
    const type = $('#post-type').val(); // Assuming you have a select element with id="post-type"
    const widgets = []; // Assuming you will collect this from additional options
    $('.options-content .toggle-input:checked').each(function() {
      widgets.push($(this).attr('name'));
    });
    const points = $('#post-points').val(); // Assuming you have an input with id="post-points" for points

    // Prepare the post data
    const postData = {
      content: content,
      privacy: privacy,
      type: type,
      widgets: widgets,
      points: points
    };

    // Send the post data to the server
    $.ajax({
      url: '/api/posts', // The URL to your post API
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(postData),
      success: function(response) {
        console.log('Post created:', response);
        $('#post-content').val(''); // Clear the textarea
        // Here you would also clear or reset any other fields if necessary
        loadPosts(); // Reload the posts to include the new one
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.error('Error creating post:', textStatus, errorThrown);
      }
    });
  }

  //POST TYPES
// Assuming you have a function to call when the user page is loaded
function loadUserPosts(userId) {
  $.ajax({
    url: `/api/user/${userId}/posts`,
    method: 'GET',
    success: function(posts) {
      displayPosts(posts);
    },
    error: function() {
      console.error('Error fetching posts');
    }
  });
}

function displayPosts(posts) {
  const postBox = $('#user-post-box');
  postBox.empty(); // Clear any existing posts

  posts.forEach(post => {
    const postElement = $('<div>').addClass('post').text(post.content);
    // Add more post details as needed
    postBox.append(postElement);
  });
}

    // Call initial functions
    updateFeed();
    loadPosts();


});
