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