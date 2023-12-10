const mongoose = require('mongoose');

const communitySchema = new mongoose.Schema({
  name: {
    type: String,
    unique: false,
    required: true
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  members: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    points: {
      type: Number,
      default: 0
    },
    rank: {
      type: String,
      default: 'Newbie' // Default rank for new members
    }
  }],
  // Other community details...
});

const Community = mongoose.model('Community', communitySchema);
module.exports = Community;