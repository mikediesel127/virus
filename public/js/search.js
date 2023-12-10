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