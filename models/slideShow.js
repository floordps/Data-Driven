var mongoose = require('mongoose');
var slideShowSchema = new mongoose.Schema({
  //options: String,
  author: String,
  date: Date,
  slideName: String,
  slides: String,
  token: {
    accessToken: String,
    refreshToken: String
  }
}, { collection: 'slideShows' } );
module.exports = mongoose.model('SlideShow', slideShowSchema, 'slideShows');
