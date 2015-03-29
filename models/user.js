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
    email: String
  },
  tokens: [{
    accessToken: String,
    refreshToken: String,
    instanceUrl: String
  }],
  slideShows: [SlideShow]
}, { collection: 'users' } );
userSchema.virtual('username').get(function() {
  return this.profile.email.toLowerCase().replace(/@.*$/, '');
});
userSchema.set('toJSON', { virtuals: true });
module.exports = mongoose.model('User', userSchema, 'users');
