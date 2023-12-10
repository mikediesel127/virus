const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  type: String, // 'like', 'comment', 'follow', etc.
  byUserId: mongoose.Schema.Types.ObjectId,
  postId: mongoose.Schema.Types.ObjectId,
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const Notification = mongoose.model('Notification', notificationSchema);
