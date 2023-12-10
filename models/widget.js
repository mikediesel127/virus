// New Widget Model
const mongoose = require('mongoose');

const widgetElementSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true
  },
  content: mongoose.Schema.Types.Mixed
});

const newWidgetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    index: true
  },
  elements: [widgetElementSchema]
});

// Registering the model
module.exports = mongoose.model('Widget', newWidgetSchema);




