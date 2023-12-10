$(document).ready(function() {
    // Draggable elements setup
    $('.draggable-element').draggable({
        helper: 'clone',
        containment: 'document',
        revert: 'invalid'
    });

    $("#widget-canvas").droppable({
        accept: ".draggable-element",
        drop: function(event, ui) {
            let elementType = ui.draggable.data("type");
            if (elementType === "text") {
                $(this).append('<input type="text" class="canvas-text-field" placeholder="Enter text...">');
            } else if (elementType === "poll") {
                let pollHtml = '<div class="canvas-poll"><input type="text" class="poll-option widget-element" placeholder="Option 1"><button class="add-poll-option">Add Option</button></div>';
                $(this).append(pollHtml);
            }
        }
    });

    $(document).on('click', '.add-poll-option', function() {
        let newOption = '<input type="text" class="poll-option widget-element" placeholder="New Option">';
        $(this).before(newOption);
    });

    // Save widget logic
    $('#save-widget').click(function() {
        alert('Widget saved!');
    });

    // Cancel widget editing logic
    $('#cancel-widget').click(function() {
        $('#widget-canvas').empty();
    });

    // Click event for adding elements to the widget canvas
    $('#element-palette .draggable-element').click(function() {
        var elementType = $(this).data('type');
        var newElement;

        switch (elementType) {
            case 'text':
                newElement = $('<input type="text" class="widget-element" placeholder="Text Field">');
                break;
            case 'poll':
                newElement = $('<div class="widget-element">Poll Element</div>'); // Modify as needed for the poll element
                break;
            // Add cases for other types of elements
        }

        if (newElement) {
            $('#widget-canvas').append(newElement);
        }
    });

    console.log('widget js loaded!');

// ------------SAVE WIDGET---------
    $('#save-widget').click(function() {
 let elements = [];
let widgetTitle = $('#widget-title').val();
  // Example of collecting text elements
  $('.canvas-text-field').each(function() {
    elements.push({
      type: 'text',
      content: $(this).val()
    });
  });

  // Example of collecting poll elements
  $('.canvas-poll').each(function() {
    let pollOptions = [];
    $(this).find('.poll-option').each(function() {
      pollOptions.push($(this).val());
    });

    elements.push({
      type: 'poll',
      content: pollOptions
    });
  });

  const widgetData = {
    name: widgetTitle,
    elements: elements
  };

  $.ajax({
    url: '/api/widgets',
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(widgetData),
    success: function(response) {
      console.log(response);
    },
    error: function(error) {
      console.error('Error saving widget:', error);
    }
  });
});




 // Enhanced function to create a widget card with delete functionality
    function createWidgetCard(widget) {
         let card = $('<div class="widget-card" data-widget-id="' + widget._id + '"></div>');
   card.append(`
            <div class="widget-title">
                ${widget.name}
                <div class="widget-settings">
                    <div class="settings-icon">⋮</div>
                    <div class="settings-menu">
                        <div class="settings-item delete-widget-btn">Delete</div>
                        <div class="settings-item share-widget-btn">Share</div>
                        <div class="settings-item edit-widget-btn">Edit</div>
                        <!-- Add more actions here -->
                    </div>
                </div>
            </div>
        `);

        widget.elements.forEach(element => {
            if (element.type === 'text') {
                card.append(`<div class="widget-content widget-text">${element.content}</div>`);
            } else if (element.type === 'poll') {
                card.append(`<div class="widget-content widget-poll">${element.content}</div>`);
            }
            // Handle other element types here
        });

        // Delete button event handler
        card.find('.delete-widget-btn').click(function() {
            deleteWidget(widget._id, card);
        });

                // Toggle settings menu
        card.find('.settings-icon').click(function() {
            $(this).siblings('.settings-menu').toggle();
        });

        // Delete button event handler
        card.find('.delete-widget-btn').click(function() {
            deleteWidget(widget._id, card);
        });

        // -----------------EDIT WIDGET------------------
        // Toggle edit mode for widget
card.find('.edit-widget-btn').click(function() {
    var widgetCard = $(this).closest('.widget-card');
    widgetCard.find('.widget-content').each(function() {
        if ($(this).hasClass('widget-text')) {
            // Make text elements editable
            var currentText = $(this).text();
            $(this).html(`<input type="text" value="${currentText}" class="edit-text">`);
        }
        // Add logic for other types of elements if needed
    });

    // Make elements draggable
    widgetCard.find('.widget-content').draggable({
        containment: 'parent',
        stop: function() {
            // Logic to update element order goes here
        }
    });

    // Change the edit button to a save button
    $(this).text('Save').removeClass('edit-widget-btn').addClass('save-widget-btn');
});

// Revert back to text on focus out for text elements
$(document).on('focusout', '.edit-text', function() {
    var updatedText = $(this).val();
    $(this).parent().text(updatedText);
});

// Save updated widget
$(document).on('click', '.save-widget-btn', function() {
    var widgetCard = $(this).closest('.widget-card');
    // Logic to collect updated widget data and send to server
    // After saving, change the save button back to edit
    $(this).text('Edit').removeClass('save-widget-btn').addClass('edit-widget-btn');
});

// ----------------END OF EDIT WIDGET----------------

        return card;
    }



        $(document).click(function(event) {
        // If the clicked area is not the settings menu and not a descendant of the settings menu
        if (!$(event.target).closest('.settings-menu').length && !$(event.target).is('.settings-icon')) {
            // Hide any open settings menus
            $('.settings-menu').hide();
        }
    });



            // Toggle widget creation box when the trigger icon is clicked
    $('#widget-creation-trigger').click(function() {
        $('#widget-creation').slideDown();
        $('#widget-creation').show();
        $('#widget-creation').slideDown();
    });

    // Hide widget creation box when 'Cancel' is clicked
    $('#cancel-widget-btn').click(function() {
        $('#widget-creation').slideUp();
        $('#widget-creation').hide();
    });
    // -----------EDIT WIDGET-----------------
    // ----------------------------------------
    // Collecting widget data
function collectWidgetData() {
  let elements = [];
  $('.canvas-poll').each(function() {
    let pollOptions = $(this).find('.poll-option').map(function() {
      return $(this).val();
    }).get();

    elements.push({
      type: 'poll',
      content: pollOptions
    });
  });

  return {
    name: $('#widgetTitle').val(), // Assuming you have an input field for the widget's title
    elements: elements,
    // Add other widget data like position and settings if applicable
  };
}

// AJAX call to save the widget
function saveWidget() {
  const widgetData = collectWidgetData();

  $.ajax({
    url: '/api/widgets',
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(widgetData),
    success: function(response) {
      console.log('Widget saved:', response);
    },
    error: function(error) {
      console.error('Error saving widget:', error);
    }
  });
}

// Example usage
$('#saveWidgetButton').on('click', saveWidget); // Assuming you have a button to trigger this action


// ----------------RENDERING AND MANAGING WIDGETS---------------------
// ----------------RENDERING AND MANAGING WIDGETS---------------------

// ----- Widget Selection Handler -----
document.getElementById('widget-selection').addEventListener('click', function(event) {
    if (event.target.classList.contains('widget')) {
        const selectedWidgetId = event.target.dataset.widgetId;
        const userId = localStorage.getItem('userID');

        addWidgetToDashboard(userId, selectedWidgetId);
    }
});

function addWidgetToDashboard(userId, widgetId) {
    $.ajax({
        url: `/api/user/${userId}/add-widget`,
        method: 'POST',
        data: { widgetId: widgetId },
        success: function(response) {
            console.log('Widget added:', response.message);
            // Update the UI to reflect the added widget
        },
        error: function(error) {
            console.error('Error adding widget:', error);
        }
    });
}

function removeWidgetFromDashboard(userId, widgetId) {
    $.ajax({
        url: `/api/user/${userId}/remove-widget`,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ widgetId: widgetId }),
        success: function(response) {
            console.log('Response from server:', response.message);
            // Update UI to reflect the widget removal
        },
        error: function(error) {
            console.error('Error removing widget:', error);
        }
    });
}

// ----- Load Available Widgets -----
function loadAvailableWidgets() {
    $.ajax({
        url: '/api/widgets', // Endpoint to fetch available widgets
        method: 'GET',
        success: function(widgets) {
            const widgetDropdown = $('#widget-dropdown');
            widgetDropdown.empty(); // Clear existing options

            widgets.forEach(widget => {
                const option = $('<option>').val(widget.id).text(widget.name);
                widgetDropdown.append(option);
            });
        },
        error: function(error) {
            console.error('Error fetching widgets:', error);
        }
    });
}

// ----- Widget Tile Creation -----
function createWidgetTile(widget) {
    const userId = localStorage.getItem('userID');
    // Main container for the widget tile
    const widgetTile = $('<div>').addClass('widget-tile');

    // Widget title
    const widgetTitle = $('<h3>').addClass('widget-title').text(widget.name);
    widgetTile.append(widgetTitle);

    // Description (if available)
    if (widget.description) {
        const widgetDescription = $('<p>').addClass('widget-description').text(widget.description);
        widgetTile.append(widgetDescription);
    }

    // Iterate through widget elements and add them to the tile
    if (widget.elements && widget.elements.length > 0) {
        const elementsContainer = $('<div>').addClass('widget-elements-container');
        widget.elements.forEach(element => {
            const elementDiv = $('<div>').addClass('widget-element').text(element.type + ': ' + element.content);
            elementsContainer.append(elementDiv);
        });
        widgetTile.append(elementsContainer);
    }

    // Add a button to interact with the widget (if needed)
    const actionButton = $('<button>').addClass('widget-action-btn').text('View Details');
    actionButton.on('click', function() {
        // Logic to handle widget interaction, such as expanding the tile to show more details
    });

     // Save Widget Button
    const saveWidgetBtn = $('<button>')
        .addClass('save-widget-btn')
        .text('Save Widget')
        .on('click', function() {
            const userId = localStorage.getItem('userID'); // Retrieve the current user's ID
            if (userId) {
                addWidgetToDashboard(userId, widget._id);
            } else {
                console.error('User ID not found');
            }
        });
            const deleteButton = $('<button>')
        .addClass('delete-widget-btn')
        .text('Delete')
        .on('click', function() {
            removeWidgetFromDashboard(userId, widget._id);
        });

    widgetTile.append(deleteButton);

    widgetTile.append(saveWidgetBtn);

    widgetTile.append(actionButton);

    return widgetTile;
}

//OTHER USER PROFILE WIDGET
 // Find all widget placeholders and create tiles for them
    $('.widget-placeholder').each(function() {
        const widgetId = $(this).data('widget-id');
        const widgetName = $(this).data('widget-name');
        // Create a mock widget object or fetch more details via AJAX if needed
        const widget = { _id: widgetId, name: widgetName, elements: [] }; // Add more properties as needed

        const widgetTile = createWidgetTile(widget);
        $(this).replaceWith(widgetTile); // Replace placeholder with the actual widget tile
    });

// ----- Display Saved Widgets -----
function displaySavedWidgets(savedWidgets) {
    const container = $('#widget-display-section');
    container.empty();

    savedWidgets.forEach(widget => {
        container.append(createWidgetTile(widget));
    });
}

// ----- Load Saved Widgets -----
function loadSavedWidgets() {
    const userId = localStorage.getItem('userID');
    if (!userId) {
        console.error('User ID not found');
        return;
    }

    $.ajax({
        url: `/api/user/${userId}/saved-widgets`,
        method: 'GET',
        success: function(savedWidgets) {
            if (savedWidgets.length === 0) {
                console.log('No saved widgets found for this user.');
            } else {
                displaySavedWidgets(savedWidgets);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error('Error fetching saved widgets:', textStatus, errorThrown);
        }
    });
}

function loadAllWidgets() {
    console.log('Loading all widgets...');
    $.ajax({
        url: '/api/widgets', // Endpoint to fetch all widgets
        method: 'GET',
        success: function(widgets) {
            console.log('All Widgets loaded:', widgets);
            const widgetContainer = $('#widget-list'); // The container for widgets in the explore section
            widgetContainer.empty(); // Clear the container before appending new widgets
            widgets.forEach(widget => {
                const widgetTile = createWidgetTile(widget);
                widgetContainer.append(widgetTile);
            });
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error('Error loading all widgets:', textStatus, errorThrown);
        }
    });
}


// ----- Initialize Widget Features -----
$(document).ready(function() {
    loadAvailableWidgets();
    loadSavedWidgets();
    loadAllWidgets();
});
// ----------------END OF RENDERING AND MANAGING WIDGETS---------------------
// ----------------END OF RENDERING ArND MANAGING WIDGETS---------------------

});
