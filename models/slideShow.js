var mongoose = require('mongoose');
var slideShowSchema = new mongoose.Schema({
  //options: String,
  author: String,
  username: String,
  date: Date,
  slideName: String,
  slides: String
}, { collection: 'slideShows' } );
module.exports = mongoose.model('SlideShow', slideShowSchema, 'slideShows');
