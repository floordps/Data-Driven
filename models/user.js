var mongoose = require('mongoose');
var SlideShow = require('./slideShow');
var userSchema = new mongoose.Schema({
  openId: String,
  username: String,
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
  },
  slideShows: [SlideShow]
}, { collection: 'users' } );
module.exports = mongoose.model('User', userSchema, 'users');
