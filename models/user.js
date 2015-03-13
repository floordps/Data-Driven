var mongoose = require('mongoose');
var userSchema = new mongoose.Schema({
  openId: String,
  profile: {
    displayName: String,
    name: {
      familyName: String,
      givenName: String,
      middleName: String
    },
    email: [{
      value: String,
      type: String
    }]
  }
}, { collection: 'users' } );
module.exports = mongoose.model('User', userSchema, 'users');
