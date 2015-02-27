var mongoose = require('mongoose');
var userSchema = new mongoose.Schema({
  openId: String
}, { collection: 'users' } );
module.exports = mongoose.model('User', userSchema, 'users');
