// models/Top8.js
const mongoose = require('mongoose');

const top8Schema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: true
  },
  items: [{
    title: String,
    description: String,
    imageUrl: String,
    link: String
  }]
});

const Top8 = mongoose.model('Top8', top8Schema);
module.exports = Top8;
