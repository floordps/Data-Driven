var mongoose = require('mongoose');
var SlideShow = require('./slideShow');
var userSchema = new mongoose.Schema({
  login: {
    username: String,
    password: String
  },
  user_id: String,
  organization_id: String,
  username: String,
  display_name: String,
  first_name: String,
  last_name: String,
  email: String
}, { collection: 'users' } );
userSchema.virtual('uname').get(function() {
  return this.email.toLowerCase().replace(/@.*$/, '');
});
userSchema.set('toJSON', { virtuals: true });
module.exports = mongoose.model('User', userSchema, 'users');
