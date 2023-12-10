const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const { Schema } = mongoose; // Destructure Schema from mongoose

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true, // Ensures usernames are unique
    index: true
  },
  password: {
    type: String,
    required: true
  },
  profilePicture: {
    type: String,
    default: 'default-profile-pic.jpg' // Set a default profile picture
  },
  points: {
    type: Number,
    default: 0
  },
  preferences: {
    darkMode: {
      type: Boolean,
      default: true // Default to light mode
    },
    // You can add more preferences here in the future
  },
  friends: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
communities: {
  type: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Community'
  }],
  default: [
    '6555bbd0fabff29f0ffee919',
    '6555bbe7fabff29f0ffee943',
    '6555bbf8fabff29f0ffee94a',
    '6555bc08fabff29f0ffee952'
  ]
},
  pendingRequests: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
savedWidgets: [{
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Widget' // Reference to the Widget model
}]

});

userSchema.methods.comparePassword = function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

// Pre-save hook to hash the password before saving it to the database
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();

  try {
    // Generate a salt
    const salt = await bcrypt.genSalt(10);
    // Hash the password using our new salt
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    console.error('Error hashing password:', error);
    next(error);
  }
});

userSchema.methods.comparePassword = function(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return callback(err);
    callback(null, isMatch);
  });
};

module.exports = User;
