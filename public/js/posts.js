// Deals with post interactions such as creating, deleting, liking, commenting, and sharing
$(document).ready(function() {
    $('#post-creation-form').on('submit', handlePostCreation);
    $('#posts-container').on('click', '.delete-btn', function() {
        const postId = $(this).closest('.post').data('post-id');
        deletePost(postId);
    });
    $(document).on('click', '.like-btn', handleLike);
    $(document).on('click', '.comment-btn', handleComment);
    $(document).on('click', '.share-btn', handleShare);

    function handlePostCreation(event) {
        event.preventDefault();
        const content = $('#post-content').val();
        createPost(content);
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

//Delete post
$('#posts-container').on('click', '.delete-btn', function() {
  const postId = $(this).closest('.post').data('post-id');
  deletePost(postId);
});

    function handleLike(event) {
        // Add logic for liking a post
    }

    function handleComment(event) {
        // Add logic for commenting on a post
    }

    function handleShare(event) {
        // Add logic for sharing a post
    }

    
});