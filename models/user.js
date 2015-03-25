var mongoose = require('mongoose');
var SlideShow = require('./slideShow');
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
  },
  slideShows: [SlideShow]
}, { collection: 'users' } );
userSchema.virtual('username').get(function() {
  return this.profile.displayName.toLowerCase().replace(/\s/, '');
});
userSchema.set('toJSON', { virtuals: true });
module.exports = mongoose.model('User', userSchema, 'users');
