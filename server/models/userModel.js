// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//   name: {
//     type: String,
//   },
//   email: {
//     type: String,
//   },
//   image: {
//     type: String
//   }
// });

// const User = mongoose.model('social-login', userSchema);

// module.exports = User;

// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//   name: {
//     type: String,
//   },
//   email: {
//     type: String,
//     unique: true, // Ensure email is unique
//   },
//   image: {
//     type: String,
//   },
//   allowed: {
//     type: Boolean,
//     default: false, // By default, users are not allowed to log in
//   },
// });

// const User = mongoose.model('social-login', userSchema);

// module.exports = User;


// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true, // Ensure email is unique
//   },
//   password: {
//     type: String,
//     required: false, // Make password optional
//   },
//   role: {
//     type: String,
//     enum: ['admin', 'user'], // Define roles
//     default: 'user',
//   },
//   allowed: {
//     type: Boolean,
//     default: false, // By default, users are not allowed to log in
//   },
// });

// const User = mongoose.model('User', userSchema);

// module.exports = User;

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // Name is required
  },
  email: {
    type: String,
    required: true, // Email is required
    unique: true, // Ensure email is unique
  },
  image: {
    type: String, // URL of the user's profile picture
  },
  role: {
    type: String,
    enum: ['admin', 'user'], // Define roles
    default: 'user', // Default role is 'user'
  },
  allowed: {
    type: Boolean,
    default: false, // By default, users are not allowed to log in
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;