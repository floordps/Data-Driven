var mongoose = require('mongoose');
var SlideShow = require('./slideShow');
var userSchema = new mongoose.Schema({
  login: {
    email: String,
    password: String,
    securityToken: String
  },
  token: {
    accessToken: String,
    refreshToken: String,
    instanceUrl: String
  },
  user_id: String,
  organization_id: String,
  username: String,
  display_name: String,
  first_name: String,
  last_name: String,
  email: String
}, { collection: 'users' } );
module.exports = mongoose.model('User', userSchema, 'users');
