const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  // ... your comment schema fields
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
