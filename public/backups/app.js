
$(document).ready(function() {

    
    // $('#show-register').on('click', toggleForms);
    $('#show-register').on('click', function(){
      $('#register-form').show();
      $('#login-form').hide();
    });
    // $(document).on('click', '#show-login', toggleForms);
        $('#show-login').on('click', function(){
      $('#login-form').show();
      $('#register-form').hide();
    });
    $('#login-form').on('submit', simulateLogin);
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
      // console.log(userId);
    const userID = localStorage.getItem("userID");
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




//[---------------------------------]
//[---------------------------------]
//[---------------------------------]
 // Function to hide all sections
  function hideAllSections() {
    $('.section').hide();
  }

  // Function to show a section
  function showSection(section) {
    hideAllSections();
    $(section).show();
  }

  // Function to toggle active class on bubbles
  function toggleActiveBubble(bubble) {
    $('.bubble').removeClass('active');
    $(bubble).addClass('active');
  }

  // Initially hide all sections and show the default section
  hideAllSections();
  showSection('.feed-content');

  // Event handlers for bubbles
  $('#profile-bubble').click(function() {
    toggleActiveBubble(this);
    showSection('.profile-content');
  });

  $('#feed-bubble').click(function() {
    toggleActiveBubble(this);
    showSection('.feed-content');
  });

  $('#explore-bubble').click(function() {
    toggleActiveBubble(this);
    showSection('.explore-content');
  });

  $('#market-bubble').click(function() {
  toggleActiveBubble(this);
  showSection('.market-content');
  // Optionally, load market items here if they are dynamically loaded
});


//-------------------------------------------------
  // Example AJAX call to load content into the main view
function loadMainViewContent(url) {
  $.ajax({
    url: url,
    type: 'GET',
    success: function(data) {
      $('#main-view-content').html(data).addClass('active-content');
    },
    error: function(error) {
      console.error('Error loading content:', error);
    }
  });
}


   const header = $('#top-header');
    const headerHeight = header.height();
    const bubblesContainer = $('#bubbles');
    const content = $('#homepage-content'); // Get the content container

    $(window).scroll(function() {
        if ($(this).scrollTop() > headerHeight) {
            header.addClass('sticky');
            header.css('transform', 'scale(0.9)');
            bubblesContainer.addClass('sticky');
            bubblesContainer.css('position', 'fixed');
            bubblesContainer.css('top', '0');
            content.css('margin-top', headerHeight + 'px'); // Add margin to compensate for header
        } else {
            header.removeClass('sticky');
            header.css('transform', 'scale(1)');
            bubblesContainer.removeClass('sticky');
            bubblesContainer.css('position', 'static');
            content.css('margin-top', '0'); // Reset margin
        }
    });



// Event listener for navbar links
$('.navbar-link').click(function(e) {
  e.preventDefault();
  var url = $(this).attr('href');
  loadMainViewContent(url);
});

//-------------------------------------------------
//-------------------------------------------------
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
                <img src="uploads/${item.profilePicture || 'default-profile-pic.jpg'}" alt="${item.username}" class="search-result-img">
                <span class="search-result-text">${item.username}</span>
              </div>
            `;
          });
          // Display the results
          $('#search-results').html(resultsHtml).addClass('visible');
          $('#search-results').show();
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
    url: `/user/${userId}`,
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
  $('#category-search-container').show();
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
console.log(isLoggedIn());

    // function showAuthForm() {
    //     $('#auth-container').show();
    //     $('#user-profile').hide();
    //     $('#main-feed').hide();
    // }

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
    // simulateLogin(username, password);
}

function simulateLogin(username, password) {
  console.log('LOGGING IN');
      event.preventDefault();
    const username1 = $('#username').val();
    const password1 = $('#password').val();
    console.log('Attempting to log in with:', username, password); // Log the credentials being sent
    // Send the login data to the server
    $.ajax({
        url: '/api/login',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ username: username1, password: password1 }),
        success: function(response) {
            console.log('Logged in:', response, username);
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('username', username);
            localStorage.setItem('userID', response.userID);

  // Set user ID in session
    // req.session.userId = response.userID;
    // console.log (req.session.userId);
    // console.log (response.userID);

            // setUserProfile();
              // Hide the login form
  $('#login-form').hide();
   // Show the logout button and profile section
  $('#logout-button').show();
  $('#user-profile').show();

      // res.redirect('/');
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
                    <a href="/user?userId=${userID}"> <h3 class="username">${response.username}</h3>
                    </a>
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

$(document).on('click', '.like-btn', function() {
  const postId = $(this).closest('.post').data('post-id');
  $.post(`/api/posts/${postId}/like`, function(response) {
    // Update the like button text with the new likes count
    $(this).html(`<i class="fas fa-heart"></i> ${response.likes.length}`);
  }.bind(this)).fail(function(jqXHR, textStatus, errorThrown) {
    console.error('Error liking post:', textStatus, errorThrown);
  });
});


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
                console.log('loading posts');
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
  const likesCount = Array.isArray(post.likes) ? post.likes.length : 0; // Check if likes is an array

// Create the HTML structure for the post
const postHtml = $(`
  <div class="post" data-post-id="${post._id}">
    <div class="post-header">
      <img src="uploads/${userProfilePicture}" alt="${username}'s profile picture" class="profile-pic">
      <div class="post-info">
        <a href="/user?userId=${post.user._id}" class="username">${username}</a>
        <span class="date">${postDate}</span>
      </div>
    </div>
    <div class="post-content">
      <p>${post.content}</p>
    </div>
    <div class="post-actions">
      <button class="action-btn like-btn"><i class="fas fa-heart"></i> ${likesCount}</button>
      <button class="action-btn comment-btn"><i class="fas fa-comment"></i></button>
      <button class="action-btn share-btn"><i class="fas fa-share"></i></button>
      <button class="action-btn delete-btn" title="Delete Post"><i class="fas fa-trash"></i></button>
    </div>
    <div class="post-comments" id="comments-${post._id}" style="display: none;"></div>
  </div>
`);


  // Append the post HTML to the posts container
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

// Example: Function to update points and rank
async function updateCommunityMemberPoints(communityId, userId, pointsToAdd) {
  const community = await Community.findById(communityId);
  const member = community.members.find(member => member.user.equals(userId));
  if (member) {
    member.points += pointsToAdd;
    member.rank = determineRank(member.points); // Implement this function based on your ranking logic
    await community.save();
  }
}

// community----------------------------------
// ------------------------------------------------
// Function to create a community
function createCommunity(name, description, creatorId) {
  $.ajax({
    url: '/api/community/create',
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({ name, description, creator: creatorId }),
    success: function(response) {
      console.log('Community created:', response.community);
      // Handle the UI update or redirection here
    },
    error: function(xhr, status, error) {
      console.error('Error creating community:', xhr.responseText);
      // Handle errors (e.g., display a message to the user)
    }
  });
}

// Function to get a community's details
function getCommunityDetails(communityId) {
  $.ajax({
    url: `/api/community/${communityId}`,
    type: 'GET',
    success: function(response) {
      console.log('Community details:', response.community);
      // Update the UI with the community details
    },
    error: function(xhr, status, error) {
      console.error('Error fetching community details:', xhr.responseText);
      // Handle errors (e.g., display a message to the user)
    }
  });
}
// Function to add a post to a community
function addPostToCommunity(communityId, content, userId) {
  $.ajax({
    url: `/api/community/${communityId}/posts`,
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({ content, userId }),
    success: function(response) {
      console.log('Post added to community:', response.post);
      // Update the UI with the new post
    },
    error: function(xhr, status, error) {
      console.error('Error adding post to community:', xhr.responseText);
      // Handle errors (e.g., display a message to the user)
    }
  });
}
 $('#create-community-form').on('submit', function(e) {
    e.preventDefault();
    const name = $('#community-name').val().trim();
    const description = $('#community-description').val().trim();
    const creatorId = 'userId'; // Replace with actual logic to get the current user's ID

    createCommunity(name, description, creatorId);


});

 // Function to fetch and display user communities
function fetchAndDisplayUserCommunities(userId) {
  $.ajax({
    url: `/api/user/${userId}/communities`, // Endpoint to get user's communities
    type: 'GET',
    success: function(communities) {
      var $communitiesList = $('#user-communities-list');
      $communitiesList.empty(); // Clear the list before adding new communities

      communities.forEach(function(community) {
        var $communityCard = $('<div>').addClass('community-card');
        var $communityName = $('<h5>').text(community.name);
        var $communityDescription = $('<p>').text(community.description);

        // Append details to the community card
        $communityCard.append($communityName, $communityDescription);

        // Append the community card to the list
        $communitiesList.append($communityCard);
      });
    },
    error: function(error) {
      console.error('Error fetching user communities:', error);
    }
  });
}

function loadUserCommunities(userId) {
  $.get('/api/user/' + userId + '/communities', function(communities) {
    var communitiesHtml = communities.map(function(community) {
      return '<div class="community-card"><h3>' + community.name + '</h3></div>';
    }).join('');
    $('#user-communities-list').html(communitiesHtml);
  });
}

// ----------ADD WIDGET-------------
// Function to add a new widget
  function addWidget(widgetType) {
    // Create widget HTML based on the type and append to the container
    // For now, let's just add a placeholder widget
    $('#widgets-container').append('<div class="widget">New ' + widgetType + ' Widget</div>');
  }



  // Toggle edit form visibility
  $(document).on('click', '.edit-top-8-btn', function() {
    $(this).siblings('.edit-top-8-form').toggle();
  });

  // Add a new item to the 'Top 8' list
  $(document).on('click', '.add-top-8-item-btn', function() {
    const newItem = $(this).siblings('.top-8-input').val();
    if (newItem) {
      $('.top-8-list').append('<li>' + newItem + '</li>');
      $(this).siblings('.top-8-input').val(''); // Clear the input field
    }
  });

   // Edit an item
  $(document).on('click', '.edit-item-btn', function() {
    const $item = $(this).closest('.top-8-item');
    const currentText = $item.find('.item-text').text();
    $item.html('<input type="text" class="edit-input" value="' + currentText + '"><button class="save-edit-btn">Save</button>');
  });

  // Save the edited item
  $(document).on('click', '.save-edit-btn', function() {
    const newText = $(this).siblings('.edit-input').val();
    const $item = $(this).closest('.top-8-item');
    $item.html('<span class="item-text">' + newText + '</span><button class="edit-item-btn">Edit</button><button class="delete-item-btn">Delete</button>');
  });

  // Delete an item
  $(document).on('click', '.delete-item-btn', function() {
    $(this).closest('.top-8-item').remove();
  });

  // ----------ADD WIDGET------------
    // Show widget creation form
$('#add-widget-btn').click(function() {
  // Show the widget-creation-modal
  $('#widget-creation-modal').slideDown();

});

  // Close the widget creation form
  $('.close').click(function() {
    $('#widget-creation-modal').slideUp();
  });

  // Handle widget creation form submission
  $('#create-widget-form').submit(function(e) {
    e.preventDefault();
    const widgetTitle = $('#widget-title').val();
    const widgetContent = $('#widget-content').val();

    // Create the new widget (you can modify this part to suit your needs)
    $('#user-profile').append('<div class="widget"><h3>' + widgetTitle + '</h3><p>' + widgetContent + '</p></div>');

    // Reset form and hide modal
    $('#widget-title').val('');
    $('#widget-content').val('');
    $('#widget-creation-modal').hide();
  });

  // ------------TOP 8 WIDGET---------------
  function addTop8Widget() {
  const top8WidgetHtml = `
    <div class="top-8-widget widget">
      <h4>Top 8</h4>
      <ul class="top-8-list">
        <!-- List items will be added here -->
      </ul>
      <button class="edit-top-8-btn">Edit</button>
    </div>
  `;
  $('#widgets-container').append(top8WidgetHtml);
}

// Assuming User is a Mongoose model
// const User = require('./models/user'); // Adjust the path as needed
  // Functions for editing and deleting widgets will be similar
  // They will manipulate the widget DOM elements and update the server

// console.log("user id:" + req.session.userId);

// Call this function when the profile page loads
  var userId = localStorage.getItem('userID');/* Retrieve the user's ID from the session or a data attribute */;
  console.log(userId);
  fetchAndDisplayUserCommunities(userId);
  // loadUserCommunities(userId);
// loadUserCommunities(userId);


  // ------------CLOUT SYSTEM------------










// -----------------------END OF CLOUT SYSTEM
  // ---------------------------------------------

  // -----------------------VIEW USERS PROFILES-----
   // Check if the viewer is the owner of the profile

  // Add click event for message button (example)
  // $('#message-button').click(function () {
  //   if (userIsLoggedInUser) {
  //     // Logic for the owner of the profile
  //     alert("You can't message yourself!");
  //   } else {
  //     // Logic for someone else
  //     alert("Message sent!");
  //   }
  // });

  // Add click event for connect button (example)
  $('#connect-button').click(function () {
    if (userIsLoggedInUser) {
      // Logic for the owner of the profile
      alert("You can't connect with yourself!");
    } else {
      // Logic for someone else
      alert("Connection request sent!");
    }
  });


// ---------------------END OF VIEW USERS PROFILES------
  // ----------------------------------------

// ------------------USER EDIT----------
// Function to toggle between view and edit mode
function toggleEditMode() {
  $('#user-profile').hide();
  $('#edit-profile').show();
  fetchUserDataForEdit();
}

// Function to go back to view mode without saving changes
function backToProfile() {
  $('#user-profile').show();
  $('#edit-profile').hide();
}

// Function to save changes and toggle back to view mode
// Function to save changes and toggle back to view mode
function saveProfileChanges() {
  const updatedUsername = $('#edit-username').val();
  // ... get other updated values ...
  const userId = localStorage.getItem('userID');
  const fileInput = document.getElementById('file-input');

  if (fileInput && fileInput.files.length > 0) {
    const profilePictureFile = fileInput.files[0];

    // Create a FormData object to handle file uploads
    const formData = new FormData();
    formData.append('profilePicture', profilePictureFile);
    formData.append('username', updatedUsername);
    // ... append other form data ...

    // Perform AJAX request to update user data
    $.ajax({
      url: `/api/user/${userId}`,
      method: 'PUT',
      data: formData,
      processData: false,
      contentType: false,
      success: function () {
        // On success, toggle back to view mode
        $('#user-profile').show();
        $('#edit-profile').hide();
      },
      error: function (error) {
        console.error('Error updating profile:', error);
        // Handle error, show a message to the user, etc.
      }
    });
  } else {
    console.error('File input is null or no files selected.');
  }
}






// Function to fetch user data and populate the edit form fields
function fetchUserDataForEdit() {
  const userId = localStorage.getItem('userID');
  // Perform AJAX request to get user data
  $.ajax({
    url: `/api/user/${userId}`, // Assuming you have an API endpoint for fetching user data
    method: 'GET',
    success: function (userData) {
      // Example: Populate username field
      $('#edit-username').val(userData.username);
      // ... populate other fields ...
       // Set the current profile picture
    $('#current-profile-pic').attr('src', userData.profilePicture);
    },
    error: function (error) {
      console.error('Error fetching user data for edit:', error);
      // Handle error, show a message to the user, etc.
    }
  });
}

// Example AJAX request to save profile changes
$('#save-changes-btn').on('click', function () {
  const userId = localStorage.getItem('userID');
  // Gather updated data from the form
  const updatedData = {
    username: $('#edit-username').val(),
    // Add other fields based on your form structure
  };

  // Perform AJAX request to save changes
  $.ajax({
    url: `/api/user/${userId}`, // Update the URL accordingly
    type: 'PUT', // Use PUT method for updating data
    data: updatedData,
    success: function (response) {
      // Handle the success response
      console.log('Profile changes saved successfully:', response);
    },
    error: function (error) {
      // Handle errors
      console.error('Error saving profile changes:', error);
    }
  });
});


// Click event for "Edit Profile" button
$('.edit-profile-btn').click(toggleEditMode);

// Click event for "Save Changes" button
$('.save-profile-btn').click(saveProfileChanges);

// Click event for "Back to Profile" button
$('.back-to-profile-btn').click(backToProfile);

// -----------SIDEBAR AND COMMUNTIY LIST---------------

const $toggleSidebar = $('#toggleSidebar');
  const $sidebar = $('.sidebar');
  const $communityList = $('#communityList');

  // Function to fetch user's communities from the server
  function getUserCommunities() {
    try {
      // Get the user ID from local storage
      const userId = localStorage.getItem('userID');

      // Check if the user ID exists
      if (!userId) {
        console.error('User ID not found in local storage.');
        return;
      }

      // Fetch user communities
      $.ajax({
        url: `/api/user/communities/${userId}`, // Pass the user ID in the URL
        type: 'GET',
        success: function(data) {
          console.log('Received communities:', data);
          renderCommunities(data); // Render communities in the sidebar
        },
        error: function(xhr, status, error) {
          console.error('Error fetching user communities:', error);
        }
      });
    } catch (error) {
      console.error('Error fetching user communities:', error);
    }
  }

  // Function to render communities in the sidebar
  function renderCommunities(communities) {
    $communityList.empty();
    communities.forEach(community => {
      const $communityItem = $('<li href="/community/'+community._id+'" class="community-item"></a href=/community/<%= community._id %>>');
      const $communityLink = $('<a href="/community/'+community._id+'" class="community-item"></a href=/community/<%= community._id %>>');

      $communityItem.append($communityLink);

      $communityItem.text(community.name);
      $communityItem.data('community-id', community._id); // Store community ID in data attribute
      
      // const $communityLink = $('<a href=class="community-link"></li>');
      // $communityList.append($communityLink);
      $communityList.append($communityItem);
    });
  }


    $(document).on("click", "#toggleSidebar",function() {
      $(".sidebar").addClass('sidebar-open');

    });

    // Add this function to close the sidebar
    window.closeSidebar = function() {
      $(".sidebar").removeClass("sidebar-open");
    };

    // Add this event to close the sidebar when clicking outside
    $(document).mouseup(function(e) {
      var sidebar = $(".sidebar");
      if (!sidebar.is(e.target) && sidebar.has(e.target).length === 0) {
        sidebar.removeClass("sidebar-open");
      }
    });


  // Fetch and render user communities on page load
  getUserCommunities();

// Handle community item click
$communityList.on('click', '.community-item', function() {
  const communityId = $(this).data('community-id');

  // AJAX request to navigate to the community page
  $.ajax({
    url: `/community?communityId=${communityId}`,
    method: 'GET',
    success: function(response) {
      // Handle the success response, e.g., navigate to the community page
      window.location.href = `/community?communityId=${communityId}`;
    },
    error: function(error) {
      console.error('Error fetching community data:', error);
      // Handle error, show a message to the user, etc.
    }
  });
});





//----------END OF SIDEBAR AND COMMUNITY-----------------

// ------------------FRIEND REQUESTS-------------

$(document).on('click', '#add-friend-btn', function() {
  var targetUserId = $(this).data('user-id');
  var authenticatedUserId = localStorage.getItem('userID');

// console.log(targetUserId + ":::" + authenticatedUserId);
  $.ajax({
    url: `/api/user/${targetUserId}/friend-request?authenticatedUserId=${authenticatedUserId}`,
    method: 'POST',
    success: function(response) {
      console.log(response);
      $("#add-friend-btn").html("Request Sent");
    },
    error: function(error) {
      console.error('Error sending friend request:', error);
    }
  });
});


// DISPLAY PENDING REQUESTS
// Function to fetch and display friend requests in the dropdown
function displayFriendRequestsDropdown() {
  const userId = localStorage.getItem('userID');

  // Perform AJAX request to get pending friend requests
  $.ajax({
    url: `/api/user/${userId}/pending-requests`,
    method: 'GET',
    success: function (pendingRequests) {
      const friendRequestList = $('#friend-request-list');

      // Clear existing items in the dropdown
      friendRequestList.empty();

      // Iterate through the pending friend requests and display them in the dropdown
      pendingRequests.forEach(request => {
        // Create a list item for each request
        const listItem = $('<li></li>');

        // Display friend request details in the list item
        listItem.html(`
          <div class="friend-request-details">
            <span class="notification-username">${request.username}</span>
            <button class="accept-btn" data-user-id="${request._id}">Accept</button>
            <button class="reject-btn" data-user-id="${request._id}">Reject</button>
          </div>
        `);

        // Append the list item to the friend request list
        friendRequestList.append(listItem);
      });


    },
    error: function (error) {
      console.error('Error fetching friend requests:', error);
    }
  });
}

$(document).on('click', '.close-btn-notify', function () {
  $('#notification-dropdown').hide();

});


// Click event to toggle friend requests when clicking the notification bubble
$(document).on('click', '#notification-bubble', function () {
$('#notification-dropdown').show('fadeIn');
      displayFriendRequestsDropdown();
});


// Click event to accept or reject a friend request
$(document).on('click', '.accept-btn, .reject-btn', function () {
  const userId = $(this).data('user-id');
  const action = $(this).hasClass('accept-btn') ? 'accept' : 'reject';

  // Perform AJAX request to handle friend request response
  $.ajax({
    url: `/api/user/${userId}/friend-request/${action}`,
    method: 'POST',
    success: function () {
      // Refresh the friend requests dropdown after accepting or rejecting
      displayFriendRequestsDropdown();
    },
    error: function (error) {
      console.error(`Error ${action}ing friend request:`, error);
    }
  });
});

// -----------DRAGGABLE NOTIFCATIONS------------------
 // Initialize draggable on the notification dropdown with a specific handle

  // -----------END OF DRAGGABLE NOTIFCATIONS




  // ---------END OF FREIND REQS----------

  // ------------END OF USER EDIT--------------

    // Call initial functions
    updateFeed();
    loadPosts();


});
