var mongoose = require('mongoose');
var slideShowSchema = new mongoose.Schema({
  //options: String,
  id: String,
  slides: String
}, { collection: 'slideShows' } );
module.exports = mongoose.model('SlideShow', slideShowSchema, 'slideShows');