const mongoose = require('mongoose');

// Define the Post schema
const postSchema = new mongoose.Schema({
  title: String,
 content: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  // Add other fields as needed
});
 likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]

// Compile the schema into a model
const Post = mongoose.model('Post', postSchema);

module.exports = Post;
