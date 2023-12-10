
$(document).ready(function() {

//     customVisibilityToggle('#show-login', '#login-form');
// customVisibilityToggle('#show-register', '#register-form');
//     $('#show-register').on('click', toggleForms);
// toggleVisibility('#show-register', '#register-form');
// toggleVisibility('#show-login', '#login-form');

    $('#login-form').on('submit', simulateLogin);
    $('#register-form').on('submit', handleRegisterForm);
    $(document).on('click', '#logout-button', logout);
    $(document).on('click', '.profile-pic', () => $('#profile-menu').toggle());
    // $(document).on('click', '.nav-item', handleNavigation);

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
    setUserProfile();

  } else {
    // Show the login form
    $('#login-form').show();
    // Hide the logout button and profile section
    $('#logout-button').hide();
    $('#user-profile').hide();
  }


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
$('#search-bubble').click(function() {
  console.log('search clicked');
  $(this).addClass('search-active'); // Toggle the 'active' class on the search bubble itself
  // You can add additional logic here if needed, like showing a search section
});
$('#notification-bubble').click(function() {
  $(this).toggleClass('notify-active'); // Toggle the 'active' class on the search bubble itself
  // You can add additional logic here if needed, like showing a search section
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
            // header.css('transform', 'scale(0.9)');
            bubblesContainer.addClass('sticky');
            bubblesContainer.css('position', 'fixed');
            bubblesContainer.css('top', '0');
            content.css('margin-top', headerHeight + 'px'); // Add margin to compensate for header
        } else {
            header.removeClass('sticky');
            // header.css('transform', 'scale(1)');
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
        // Now check the friend request status
    checkFriendRequestStatus(userId);
    },
    error: function(error) {
      console.error('Error fetching profile:', error);
    }
  });
  var userID = localStorage.getItem('userID');

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
          setUserProfile();
            console.log('Logged in:', response, username);
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('username', username);
            localStorage.setItem('userID', response.userID);

            // Hide the login form
            $('#login-form').hide();
             // Show the logout button and profile section
            $('#logout-button').show();
            $('#user-profile').show();
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
              loadUserCommunities(userID);
              $('.username').html(response.username);
            
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

// ----------------DARKMODE---------------
 $('#dark-mode-toggle').on('change', function() {
    var userId = localStorage.getItem('userID'); // Retrieve the user ID from storage
    var isDarkMode = $(this).is(':checked');

    // Toggle dark mode class on body
    if (isDarkMode) {
      $('body').addClass('dark-mode');
    } else {
      $('body').removeClass('dark-mode');
    }

    // Update preferences on the server
    updatePreferences(userId, { darkMode: isDarkMode });
  });

function updatePreferences(userId, preferences) {
  $.ajax({
    url: `/api/user/${userId}/preferences`,
    method: 'POST',
    contentType: 'application/json', // Ensure correct content type for JSON data
    data: JSON.stringify({ preferences }), // Convert preferences object to JSON string
    success: function(response) {
      console.log('Preferences updated:', response);
    },
    error: function(error) {
      console.error('Error updating preferences:', error);
    }
  });
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
    $.ajax({
        url: '/api/posts',
        method: 'GET',
        success: function(posts) {
            console.log('Posts loaded:', posts);
            const postsContainer = $('#posts-container');
            postsContainer.empty();

            if (Array.isArray(posts) && posts.length > 0) {
                posts.forEach(post => addPostToUI(post));
            } else {
                console.log('No posts available to display.');
                postsContainer.append('<p>No posts available.</p>');
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error('Error loading posts:', textStatus, errorThrown);
            $('#posts-container').html('<p>Error loading posts. Please try again later.</p>');
        }
    });
}




function addPostToUI(post) {
    if (!post || !post.user) {
        console.error('Invalid post data:', post);
        return;
    }

    const postDate = new Date(post.createdAt).toLocaleString();
    const userProfilePic = post.user.profilePicture ? `uploads/${post.user.profilePicture}` : 'default-profile-pic.jpg';
    const postHtml = `
        <div class="post" data-post-id="${post._id}">
            <div class="post-header">
                <div class="post-info">
                    <img src="${userProfilePic}" alt="${post.user.username}'s profile picture" class="post-user-profile-pic">
                    <a href="/user?userId=${post.user._id}" class="username">${post.user.username}</a>
                    <span class="date">${postDate}</span>
                </div>
            </div>
            <div class="post-content">
                <p>${post.content}</p>
            </div>
        </div>
    `;

    $('#posts-container').append(postHtml);
}

function formatDateForPost(postDate) {
    const now = new Date();
    const postDateTime = new Date(postDate);
    const options = { day: 'numeric', weekday: 'long' };

    // Include the month in the format if the post is from a different month
    if (postDateTime.getMonth() !== now.getMonth() || postDateTime.getFullYear() !== now.getFullYear()) {
        options.month = 'long';
    }

    return postDateTime.toLocaleString('en-US', options);
}





// -------TABS------
// Single event listener for tab clicks
$('.tab-link').click(function() {
  var postType = $(this).data('post-type');
  $('.post-box').hide();
  $('.post-box-' + postType).show();
  $('.tab-link').removeClass('active');
  $(this).addClass('active');
});

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
// // Assuming you have a function to call when the user page is loaded
// function loadUserPosts(userId) {
//     $.ajax({
//         url: `/api/user/${userId}/posts`,
//         method: 'GET',
//         success: function(posts) {
//             const postsContainer = $('#posts-container');
//             postsContainer.empty(); // Clear any existing posts
//             posts.forEach(post => {
//                 addPostToUI(post);
//             });
//         },
//         error: function() {
//             console.error('Error fetching posts');
//         }
//     });
// }


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

// Call this function when the profile page loads
  var userId = localStorage.getItem('userID');/* Retrieve the user's ID from the session or a data attribute */;
  console.log(userId);
  fetchAndDisplayUserCommunities(userId);

  // ------------CLOUT SYSTEM------------

// -----------------------END OF CLOUT SYSTEM

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
        const $communityItem = $('<li class="community-item"></li>');
        const $communityLink = $(`<a href="/community?communityId=${community._id}" class="community-link"></a>`);
        const $communityPicture = $('<img src="uploads/virus-logo.png" class="community-profile-pic">');

        $communityLink.append($communityPicture);
        $communityLink.append(document.createTextNode(community.name)); // Text node for community name
        $communityItem.append($communityLink);

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

  $.ajax({
    url: `/api/user/${targetUserId}/accept-friend-request?authenticatedUserId=${authenticatedUserId}`,
    method: 'POST',
    success: function(response) {
      console.log(response);
      // Update UI accordingly, e.g., remove the request from the list
    },
    error: function(error) {
      console.error('Error accepting friend request:', error);
    }
  });
});



// DISPLAY PENDING REQUESTS
// Function to fetch and display friend requests in the dropdown
function displayFriendRequestsDropdown() {
  const userId = localStorage.getItem('userID');

  $.ajax({
    url: `/api/user/${userId}/pending-requests`,
    method: 'GET',
    success: function(pendingRequests) {
      const friendRequestList = $('#friend-request-list');
      const notificationCount = $('#notification-count'); // Update the count here

      friendRequestList.empty();
      notificationCount.text(pendingRequests.length); // Set the number of pending requests

      pendingRequests.forEach(request => {
        const listItem = $('<li></li>');
        listItem.html(`
          <div class="friend-request-details">
            <span class="notification-username">${request.username}</span>
            <button class="accept-btn" data-user-id="${request._id}">Accept</button>
            <button class="reject-btn" data-user-id="${request._id}">Reject</button>
          </div>
        `);
        friendRequestList.append(listItem);
      });
    },
    error: function(error) {
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
   const notificationCount = $('#notification-count'); // Update the count here

    
  


// ------------------GET PREFERENCES------------
 var userId = localStorage.getItem('userID'); // Retrieve the user ID from storage

  // Fetch and apply user preferences
  if (userId) {
    $.ajax({
      url: `/api/user/${userId}/preferences`,
      method: 'GET',
      success: function(response) {
        if (response.darkMode) {
          $('body').addClass('dark-mode');
          $('#dark-mode-toggle').prop('checked', true);
        }
      },
      error: function(error) {
        console.error('Error fetching preferences:', error);
      }
    });
  }
  // --------------end of GET preferences-----------

    // Call initial functions
    updateFeed();
    loadPosts();

    // ---------------------SEARCH BAR !!!!!!!!!!!!!

    $('#search-input').on('keyup', function() {
        const searchTerm = $(this).val();

        if (searchTerm.length > 0) {
            $("#search-results").show();
            searchUsersAndWidgets(searchTerm);
        } else {
            $("#search-results").hide();
            clearSearchResults();
        }
    });

$('#widget-results').on('click', '.search-result-item', function() {
    const widgetId = $(this).data('id');

    console.log(`Frontend sending widget ID: ${widgetId}`);

    // Assume the current user's ID is retrieved correctly
    const userId = localStorage.getItem('userID');

    if (userId && widgetId) {
        $.ajax({
            url: `/api/user/${userId}/add-widget`,
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ widgetId: widgetId }),
            success: function(response) {
                console.log('Response from server:', response.message);
            },
            error: function(error) {
                console.error('Error saving widget:', error);
            }
        });
    } else {
        console.error('User ID or Widget ID is missing');
    }
});


function searchUsersAndWidgets(searchTerm) {
    $.ajax({
        url: '/api/search',
        type: 'GET',
        data: { query: searchTerm },
        success: function(response) {
            displaySearchResults(response.users, 'user');
            displaySearchResults(response.widgets, 'widget');
            displaySearchResults(response.communities, 'community');
        },
        error: function(error) {
            console.error('Error fetching search results:', error);
        }
    });
}

// $(document).on('click', '.search-result-item', function(event) {
//     event.preventDefault(); // Prevent default link behavior

//     const profileUserId = $(this).data('user-id'); // Assuming you store the user ID in a data attribute
//     const currentUserId = localStorage.getItem('userID');

//     checkFriendRequestStatus(currentUserId, profileUserId);

//     // Optionally, handle navigation to the user profile page if you are not using traditional href navigation
//     // navigateToUserProfile(profileUserId);
// });

function displaySearchResults(results, type) {
   const resultsContainer = type === 'user' ? '#user-results' : (type === 'widget' ? '#widget-results' : '#community-results');

    $(resultsContainer).empty();

    console.log(`Displaying ${type} results:`, results); // Debugging line

    results.forEach(result => {
        let resultItem;

        if (type === 'user') {
            // User results handling
            resultItem = $(`<a href="/user?userId=${result.id}" class="search-result-item"></a>`);
            const resultImg = $('<img>').addClass('profile-pic-mini').attr('src', '/uploads/' + result.profilePicture);
            resultItem.text(`${result.name}`);
            resultItem.prepend(resultImg);
        } else if (type === 'widget') {
            // Widget results handling
            resultItem = $('<div>').addClass('search-result-item').attr('data-type', type).attr('data-id', result.id);
            const resultImg = $('<img>').addClass('profile-pic-mini').attr('src', '/uploads/widget-logo.jpg');
            resultItem.text(`${result.name}`);
            resultItem.prepend(resultImg);
            resultItem.click(function() {
                addUserWidget(result.id);
            });
        } else if (type === 'community') {
            // Community results handling
            resultItem = $(`<a href="/community?communityId=${result.id}" class="search-result-item"></a>`);
            const resultImg = $('<img>').addClass('profile-pic-mini').attr('src', '/uploads/' + 'Virus-Logo.png');
            resultItem.text(`${result.name}`);
            resultItem.append(resultImg);
            // Add community image if available
        }

        $(resultsContainer).append(resultItem);
    });
}


// function addUserWidget(widgetId) {
//     const userId = localStorage.getItem('userID'); // Retrieve the user's ID

//     $.ajax({
//         url: `/api/user/${userId}/add-widget`,
//         method: 'POST',
//         data: { widgetId: widgetId },
//         success: function(response) {
//             console.log('Widget added to profile:', response);
//             // Additional logic to reflect the update in the UI
//         },
//         error: function(error) {
//             console.error('Error adding widget to profile:', error);
//         }
//     });
// }

function clearSearchResults() {
    $('#user-results, #widget-results').empty();
}

function handleSearchResultClick(item) {
    const type = item.data('type');
    const id = item.data('id');
    const userId = localStorage.getItem('userID'); // Replace with actual user ID retrieval logic

    if (type === 'user') {
        window.location.href = `/user?userId=${id}`;
    } else if (type === 'widget') {
        // Logic for handling widget click: Save the widget to the user's profile
        $.ajax({
            url: `/api/user/${userId}/save-widget`,
            method: 'POST',
            data: { widgetId: id },
            success: function(response) {
                console.log(response.message);
                loadUserWidgets(userId); // Reload the user's widgets to reflect the new addition
            },
            error: function(error) {
                console.error('Error saving widget:', error);
            }
        });
    }
}

// ---------DISPLAY OTHER USERS WIDGETS ON OTHER-USER-PAGE-----------


// ---------END OF DISPLAY OTHER USERS WIDGETS ON OTHER-USER-PAGE-----------
    // ---------------------SEARCH BAR !!!!!!!!!!!!!

document.querySelectorAll('.background-option').forEach(item => {
    item.addEventListener('click', function() {
        const selectedBackground = this.getAttribute('data-bg');
        const backgroundImageUrl = 'uploads/' + selectedBackground;

        // Create a new style element
        const style = document.createElement('style');
        style.type = 'text/css';

        // Insert CSS rule
        style.innerHTML = `body { background-image: url('${backgroundImageUrl}'); }`;
        document.head.appendChild(style);
    });
});

// ------------LOAD FRIENDS LIST----------
// ------------LOAD FRIENDS LIST----------

function loadFriendsList(userId) {
  $.ajax({
    url: `/api/user/${userId}/friends`,
    method: 'GET',
    success: function(friends) {
      const $friendList = $('.friendList');
      $friendList.empty(); // Clear existing list

      friends.forEach(friend => {
        // Assuming each friend object has 'username' and 'profilePicture'
        const $friendItem = $(`
          <a href="/user?userId=${friend._id}" class="friend-item">
            <img src="${friend.profilePicture}" alt="${friend.username}" class="friend-profile-pic post-user-profile-pic">
            <span>${friend.username}</span>
          </a>
        `);
        $friendList.append($friendItem);
      });
    },
    error: function(error) {
      console.error('Error loading friends:', error);
    }
  });
}


// Call this function with the current user's ID
loadFriendsList(userId);


// ------------------FRIEND REQUESTS HANDLING--------------
// ------------------FRIEND REQUESTS HANDLING--------------

function checkFriendRequestStatus(profileUserId) {
    const currentUserId = localStorage.getItem('userID'); // Retrieve the current user's ID from localStorage
console.log('CHECKING FRIEND REQUEST STATUS BETWEEN: logged in: ' + currentUserId
  + ":: other user: " + profileUserId);
    if (!currentUserId) {
        console.error('Current user ID not found');
        return;
    }

    $.ajax({
        url: `/api/friendship-status/${currentUserId}/${profileUserId}`,
        method: 'GET',
        success: function(status) {
            console.log('Friendship status:', status);
            const addFriendBtn = $('#add-friend-btn');
            switch (status) {
                case 'friends':
                    addFriendBtn.text('Friends').attr('disabled', true);
                    break;
                case 'request_sent':
                    addFriendBtn.text('Request Sent').attr('disabled', true);
                    break;
                case 'request_received':
                    addFriendBtn.text('Accept Request').attr('disabled', false);
                    addFriendBtn.off('click').on('click', function() {
                        acceptFriendRequest(profileUserId);
                    });
                    break;
                default:
                    addFriendBtn.text('Add Friend').attr('disabled', false);
                    addFriendBtn.off('click').on('click', function() {
                        sendFriendRequest(profileUserId);
                    });
                    break;
            }
        },
        error: function(error) {
            console.error('Error checking friendship status:', error);
        }
    });
}

function sendFriendRequest(profileUserId) {
    // Implement the logic to send a friend request
    console.log('Sending friend request to:', profileUserId);
    // Add AJAX call to send the request
}

function acceptFriendRequest(profileUserId) {
    // Implement the logic to accept a friend request
    console.log('Accepting friend request from:', profileUserId);
    // Add AJAX call to accept the request
}

// ------------------------------------------------------------
// ------------------------------------------------------------
function sendFriendRequest(userId) {
    $.ajax({
        url: `/api/user/${userId}/send-friend-request`,
        method: 'POST',
        success: function() {
            $('#friend-status-button').text('Request Sent').off('click');
        },
        error: function(error) {
            console.error('Error sending friend request:', error);
        }
    });
}
$('#inbox-bubble').on('click', function() {
    console.log("Inbox bubble clicked"); // For testing
    $('#chat-sidebar').addClass('chat-sidebar-open');
});
// function checkAndDisplayFriendStatus(userId) {
//     $.ajax({
//         url: `/api/user/${userId}/check-friend-status`,
//         method: 'GET',
//         success: function(response) {
//             const statusButton = $('#friend-status-button'); // The button or element to update
//             switch(response.status) {
//                 case 'friends':
//                     statusButton.text('Friends');
//                     break;
//                 case 'requestSent':
//                     statusButton.text('Request Sent');
//                     break;
//                 default:
//                     statusButton.text('Add Friend');
//                     statusButton.click(function() {
//                         sendFriendRequest(userId);
//                     });
//             }
//         },
//         error: function(error) {
//             console.error('Error checking friendship status:', error);
//         }
//     });
// }

// // Call this function on page load or when displaying a user profile
// checkAndDisplayFriendStatus(userId); // Replace 'userId' with the actual user ID

// ------------------END OF FRIEND REQUESTS HANDLING--------------
// ------------------END OF FRIEND REQUESTS HANDLING--------------

// ------------END OF LOAD FRIENDS LIST----------
// ------------END OF LOAD FRIENDS LIST----------

// ---------------[CHAT // MESSAGING]----------------
// ---------------[CHAT // MESSAGING]----------------

$('#message-button').on('click', function() {
    console.log('CLICKED MESSSAGE!!!!!!!!!!!!!!!!!!!!!!!');
    $('#chat-container').show();
});

$('#chat-form').on('submit', function(e) {
    e.preventDefault();
    const message = $('#chat-input').val();
    if (message.trim() !== '') {
        // Append the message with additional formatting
        $('#chat-messages').append($('<li class="sent-message">').text(message));
        $('#chat-input').val('');
    }
});

$('#close-chat').on('click', function() {
    $('#chat-container').hide();
});

// JavaScript for Populating Chat Sidebar
function loadChatList() {
    // Fetch chat list data from backend (pseudo-code)
    const chatList = fetchChatList(); // Replace with actual AJAX call

    chatList.forEach(chat => {
        const listItem = $('<li>').addClass('chat-list-item').text(chat.username);
        listItem.on('click', () => openChat(chat.userId));
        $('#chat-list').append(listItem);
    });
}

function openChat(userId) {
    // Logic to open chat window with the selected user
    $('#chat-container').show();
    // Load chat history with userId...
     loadChatConversation(userId);
}



    // Function to parse query parameters
    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    // Check for 'openChat' parameter in the URL
    const openChatUserId = getQueryParam('openChat');
    if (openChatUserId) {
      console.log("OPEN CHAT USER ID---------------------------------- = "+ openChatUserId);
        openChatWithUser(openChatUserId);
         loadChatConversation(userId);
    }


// On other user profiles
$('#message-button').on('click', function() {
    const targetUserId = $(this).data('user-id');

    window.location.href = `/?openChat=${targetUserId}`;

});

// On main page (index.js)
$(document).ready(function() {
    const urlParams = new URLSearchParams(window.location.search);
    const openChat = urlParams.get('openChat');
    if (openChat) {
        $('#chat-sidebar').addClass('chat-sidebar-open');
        openChat(openChat); // Function to load and open chat with the specified user
    }
});
// --------------------

// Update the send message button event handler
$('#send-message-btn').click(function() {
    const messageContent = $('#chat-message-input').val().trim();
    const receiverId = $('#chat-window').data('currentChatPartner');
    const senderId = localStorage.getItem('userID'); // Retrieve the sender's user ID

    if (messageContent && receiverId && senderId) {
        sendMessage(senderId, receiverId, messageContent);

        // Append the message to the chat window immediately for instant feedback
        appendMessageToChat(senderId, messageContent);

        // Clear the input field
        $('#chat-message-input').val('');
    }
});

    function loadFriendsList() {
    const userId = localStorage.getItem('userID');
    if (!userId) {
        console.error('User ID not found');
        return;
    }

    $.ajax({
        url: `/api/user/${userId}/friends`,
        method: 'GET',
        success: function(friends) {
            $('#chat-sidebar-friends-list').empty();
            friends.forEach(friend => {
                $('#chat-sidebar-friends-list').append(`
                  <div class="chat-sidebar-friend-item" data-user-id="${friend._id}">
                    ${friend.username}
                  </div>
                `);
            });
        },
        error: function(error) {
            console.error('Error fetching friends:', error);
        }
    });
}

// Call this function when the sidebar is opened
loadFriendsList();
loadRecentChats(userId);
$('#chat-sidebar-friends-list').on('click', '.chat-sidebar-friend-item', function() {
    const friendId = $(this).data('user-id');
    const friendName = $(this).text();

    // Placeholder for opening chat interface
    openChatWithFriend(friendId, friendName);
});



function appendMessageToChat(userId, message) {
    const chatArea = $('#chat-area');
    const messageElement = $('<div>').addClass(userId === localStorage.getItem('userID') ? 'outgoing-message' : 'incoming-message');
    messageElement.text(message);
    chatArea.append(messageElement);
}

// chat.js or a similar frontend JavaScript file

function searchChatUsers(searchTerm) {
    $.ajax({
        url: '/api/chat/search-users',
        type: 'GET',
        data: { query: searchTerm },
        success: function(users) {
            displayChatSearchResults(users);
        },
        error: function(error) {
            console.error('Error fetching users for chat:', error);
        }
    });
}

function displayChatSearchResults(users) {
    const chatSearchResultsContainer = $('#chat-search-results');
    chatSearchResultsContainer.empty();

    users.forEach(user => {
        const userItem = $(`<div class="chat-search-result-item search-result-item" data-user-id="${user.id}"></div>`);
        const userImg = $('<img>').addClass('chat-user-pic-mini profile-pic').attr('src', '/uploads/' + user.profilePicture);
        userItem.text(`${user.name}`);
        userItem.prepend(userImg);

        userItem.click(function() {
            const selectedUserId = $(this).data('user-id');
            openChatWithUser(selectedUserId); // Function to initiate chat with the user
        });

        chatSearchResultsContainer.append(userItem);
    });
}

function openChatWithUser(userId) {

    // Logic to open chat interface with selected user
    // Load chat history, set up chat UI, etc.
}

   $('#chat-search-input').on('input', function() {
        const searchTerm = $(this).val().trim();

        // Call search function only if the search term is not empty
        if (searchTerm) {
            searchChatUsers(searchTerm);
        } else {
            // Clear results if the search term is empty
            $('#chat-search-results').empty();
        }
    });


function loadChatConversation(selectedUserId) {
    // Retrieve the selected user's details (e.g., name)
    $.ajax({
        url: `/api/user/${selectedUserId}`,
        method: 'GET',
        success: function(user) {
            // Display the user's name in the chat header
            $('#chat-window').empty(); // Clear previous conversation if any
            const chatHeader = $('<div>').addClass('chat-header').text(user.username);
            $('#chat-window').append(chatHeader);

            // Set the data attribute for the current chat partner
            $('#chat-window').data('currentChatPartner', selectedUserId);
            updateChatHeader(user); // Update the chat header with selected user's details
            // Load the conversation history (if this part is implemented)
            loadConversationHistory(selectedUserId);



        },
        error: function(error) {
            console.error('Error loading user data for chat:', error);
        }
    });
}

function loadConversationHistory(selectedUserId) {
    const currentUserId = localStorage.getItem('userID'); // Retrieve the current user's ID

    if (!currentUserId) {
        console.error('Current user ID not found');
        return;
    }

    $.ajax({
        url: `/api/chat/conversation/${currentUserId}/${selectedUserId}`, // Updated API endpoint
        method: 'GET',
        success: function(messages) {
            // Display the fetched messages in the chat window
            displayConversation(messages);
        },
        error: function(error) {
            console.error('Error loading conversation history:', error);
        }
    });
}



function displayConversation(messages) {
    const chatWindow = $('#chat-window');
    chatWindow.empty();

    messages.forEach(message => {
        const messageElement = $('<div>').addClass('chat-message');
        if (message.sender === localStorage.getItem('userID')) {
            messageElement.addClass('sent');
        } else {
            messageElement.addClass('received');
        }
        messageElement.text(message.content);
        chatWindow.append(messageElement);
    });

    // Scroll to the bottom of the chat window to show the latest messages
    chatWindow.scrollTop(chatWindow.prop('scrollHeight'));
}

// ------------DISPLAY CHAT----------



$('#chat-search-results').on('click', '.chat-search-result-item', function() {
  event.stopPropagation();
  $('#chat-search-results').empty();
    const selectedUserId = $(this).data('user-id');
    loadChatConversation(selectedUserId);

});

// Function to append a message to the chat window
function appendMessageToChat(userId, messageContent) {
    const chatWindow = $('#chat-window');
    const isCurrentUser = userId === localStorage.getItem('userID');

    // Create the message element with appropriate classes
    const messageDiv = $('<div>')
        .addClass('chat-message')
        .addClass(isCurrentUser ? 'sent' : 'received')
        .text(messageContent);

    chatWindow.append(messageDiv);

    // Scroll to the bottom of the chat window
    chatWindow.scrollTop(chatWindow.prop('scrollHeight'));
}

// Update the send message button event handler
$('#send-message-btn').click(function() {
    const messageContent = $('#chat-message-input').val().trim();
    const receiverId = $('#chat-window').data('currentChatPartner');
    const senderId = localStorage.getItem('userID'); // Retrieve the sender's user ID

    if (messageContent && receiverId && senderId) {
        sendMessage(senderId, receiverId, messageContent);

        // Append the message to the chat window immediately for instant feedback
        appendMessageToChat(senderId, messageContent);

        // Clear the input field
        $('#chat-message-input').val('');
    }
});

// Existing sendMessage function remains the same
function sendMessage(senderId, receiverId, content) {
    $.ajax({
        url: '/api/messages/send',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ sender: senderId, receiver: receiverId, content: content }),
        success: function(response) {
            console.log('Message sent:', response);
        },
        error: function(error) {
            console.error('Error sending message:', error);
        }
    });
}

// SEND MESSAGE WHEN PRESS ENTER
// Event listener for the chat message input
$('#chat-message-input').on('keypress', function(e) {
    // Check if the Enter key is pressed
    if (e.key === "Enter" || e.keyCode === 13) {
        e.preventDefault(); // Prevent the default action of the Enter key

        const messageContent = $(this).val().trim();
        const receiverId = $('#chat-window').data('currentChatPartner');
        const senderId = localStorage.getItem('userID'); // Retrieve the sender's user ID

        // Check if there is a message and a receiver
        if (messageContent && receiverId && senderId) {
            sendMessage(senderId, receiverId, messageContent);

            // Append the message to the chat window for instant feedback
            appendMessageToChat(senderId, messageContent);

            // Clear the input field
            $(this).val('');
        }
    }
});

function loadRecentChats() {
    console.log("LOAD RECENT CHATS CALLED");
    const userId = localStorage.getItem('userID');
    if (!userId) {
        console.error('User ID not found');
        return;
    }

    $.ajax({
        url: `/api/chat/recent/${userId}`,
        method: 'GET',
        success: function(recentChats) {
          console.log(recentChats);
            displayRecentChats(recentChats);
        },
        error: function(error) {
            console.error('Error fetching recent chats:', error);
        }
    });
}

function displayRecentChats(recentChats) {

  console.log("DISPALY RECENT CHATS CALLED");
    const recentChatsContainer = $('#recent-chats-container');
    recentChatsContainer.empty();

    recentChats.forEach(chat => {
        const userId = chat._id;
        $.ajax({
            url: `/api/user/${userId}`,
            method: 'GET',
            success: function(user) {
                const chatItem = $('<div>').addClass('chat-item').data('user-id', userId);
                const userImg = $('<img>').addClass('user-pic-mini').attr('src', '/uploads/' + user.profilePicture);
                const userName = $('<span>').addClass('user-name').text(user.username);

                chatItem.append(userImg, userName);
                chatItem.click(function() {
                    loadChatConversation(userId);
                    updateChatHeader(user); // Update the chat header with selected user's details
                });

                recentChatsContainer.append(chatItem);
            },
            error: function(error) {
                console.error('Error loading user details:', error);
            }
        });
    });
}

function updateChatHeader(user) {
    const chatHeader = $('#chat-header');
    chatHeader.empty();
    const userImg = $('<img>').addClass('user-pic').attr('src', '/uploads/' + user.profilePicture);
    const userName = $('<a>').addClass('user-name').text(user.username);
userName.attr('href', `/user?userId=${user.id}`);
    chatHeader.append(userImg, userName);
}






// -----------END OF [CHAT // MESSAGING]----------------

// -------[LOAD NOTIFICATIONS SIDEBAR]------------

function togglePeopleSidebar() {
    $('#people-sidebar').show();
    $('#chat-sidebar, #notification-sidebar').hide();
}

function toggleInboxSidebar() {
    $('#chat-sidebar').show();
    // $('#inboxs-content').show();
    $('#people-sidebar, #notification-sidebar').hide();
}

function toggleNotificationSidebar() {
    $('#notification-sidebar').show();
    $('#people-sidebar, #chat-sidebar').hide();
}

$('#people-bubble').click(togglePeopleSidebar);
$('#inbox-bubble').click(toggleInboxSidebar);
$('#notification-bubble').click(toggleNotificationSidebar);

$(document).click(function(event) {
    if (!$(event.target).closest('#people-sidebar, #people-bubble').length) {
        $('#people-sidebar').hide();
    }

    if (!$(event.target).closest('#chat-sidebar, #inbox-bubble').length) {
        $('#chat-sidebar').hide();
    }

    if (!$(event.target).closest('#notification-sidebar, #notification-bubble').length) {
        $('#notification-sidebar').hide();
    }
});
// ----------------END OF BUBBLE CLICKING LOGIC-----------

});

