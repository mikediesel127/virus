// community.js

$(document).ready(function() {
  // Function to load communities
  function loadCommunities() {
    $.get('/api/communities', function(data) {
      data.forEach(function(community) {
        $('#community-list').append(`
          <div class="community">
            <h3>${community.name}</h3>
            <p>${community.description}</p>
            <!-- More community details here -->
          </div>
        `);
      });
    });
  }

  // Load communities on page load
  loadCommunities();

  // Toggle create community modal
  $('#create-community-btn').on('click', function() {
    $('#create-community-modal').toggle();
  });

  // Add this to your community.js or directly in a <script> tag in community.ejs

// Get the modal
var modal = document.getElementById('create-community-modal');

// Get the button that opens the modal
var btn = document.getElementById('create-community-btn');

// Get the <span> element that closes the modal
var span = document.getElementsByClassName('close')[0];

// When the user clicks the button, open the modal 
btn.onclick = function() {
  modal.style.display = 'block';
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = 'none';
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = 'none';
  }
}


// When the user clicks the button, open the modal with animation
btn.onclick = function() {
  modal.style.display = 'block';
  document.querySelector('.modal-content').classList.add('show');
}

// When the user clicks on <span> (x), close the modal with animation
span.onclick = function() {
  document.querySelector('.modal-content').classList.remove('show');
  setTimeout(() => { modal.style.display = 'none'; }, 300);
}

// When the user clicks anywhere outside of the modal, close it with animation
window.onclick = function(event) {
  if (event.target == modal) {
    document.querySelector('.modal-content').classList.remove('show');
    setTimeout(() => { modal.style.display = 'none'; }, 300);
  }
}
 $('#search-input').on('keyup', function() {
    var value = $(this).val().toLowerCase();
    $('.community-card').filter(function() {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
  });

$(document).on('click', '.join-community-btn', function() {
  const communityId = $(this).data('community-id');
  joinCommunity(communityId);
});


// Function to post a new community to the server
  function createCommunity(name, description) {
    $.ajax({
      url: '/api/community/create',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({ name, description }),
      success: function(community) {
        console.log('Community created:', community);
        // Here you can add code to update the UI with the new community
        fetchAndDisplayCommunities(); // Refresh the list of communities
      },
// Inside the createCommunity function's error callback
error: function(xhr, status, error) {
  var errorMessage = xhr.responseText;
  // Check if the error is a duplicate key error
  if (xhr.status === 500 && errorMessage.includes('E11000 duplicate key error')) {
    alert('A community with this name already exists. Please choose a different name.');
  } else {
    console.error('Error creating community:', errorMessage);
  }
}

    });
  }

  // Event handler for the create community form submission
  $('#create-community-form').on('submit', function(e) {
    e.preventDefault();
    var name = $('#community-name').val().trim();
    var description = $('#community-description').val().trim();

    if (name && description) {
      createCommunity(name, description);
    } else {
      alert('Please fill in all fields.');
    }
  });

  // Function to fetch communities and update the UI
  function fetchAndDisplayCommunities() {
    $.ajax({
      url: '/api/communities',
      type: 'GET',
      success: function(communities) {
        var $communityList = $('#community-list');
        $communityList.empty(); // Clear the list before adding new communities

        communities.forEach(function(community) {
          var $communityCard = $('<div>').addClass('community-card');
          var $communityName = $('<h3>').text(community.name);
          var $communityDescription = $('<p>').text(community.description);
          // Inside the success function of the fetchAndDisplayCommunities function
var $joinButton = $('<button>').addClass('join-btn').text('Join').data('community-id', community._id);

          // Append details to the community card
          $communityCard.append($communityName, $communityDescription, $joinButton);
          // Append the community card to the list
          $communityList.append($communityCard);
        });
      },
      error: function(error) {
        console.error('Error fetching communities:', error);
      }
    });
  }

  // Call fetchAndDisplayCommunities on page load to display communities
  fetchAndDisplayCommunities();

$(document).on('click', '.join-btn', function() {
  const communityId = $(this).data('community-id');
  var userId = localStorage.getItem('userID'); // Retrieve the user's ID from localStorage

  console.log('User ID from localStorage:', userId);

  $.ajax({
    url: `/api/community/join/${communityId}?userId=${userId}`, // Include the userId in the URL as a query parameter
    type: 'POST',
    success: function(data) {
      console.log('Successfully joined community', data);
    },
    error: function(xhr, status, error) {
      const errorMessage = xhr.responseJSON && xhr.responseJSON.error ? xhr.responseJSON.error : 'Unknown error occurred.';
      console.error('Error joining community:', errorMessage);
    }
  });
});




  // Call the function to fetch and display communities
  fetchAndDisplayCommunities();



});
