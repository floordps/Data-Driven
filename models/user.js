var mongoose = require('mongoose');
var userSchema = new mongoose.Schema({
  username: String,
  password: String
}, { collection: 'users' } );
module.exports = mongoose.model('User', userSchema, 'user');
