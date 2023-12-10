const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserWidgetSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  widgetId: { type: Schema.Types.ObjectId, ref: 'Widget' },
  position: {
    x: Number,
    y: Number
  },
  settings: Schema.Types.Mixed  // This can store user-specific settings for the widget
});

module.exports = mongoose.model('UserWidget', UserWidgetSchema);
