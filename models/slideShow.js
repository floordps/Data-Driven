var mongoose = require('mongoose');
var slideShowSchema = new mongoose.Schema({
  //options: String,
  author: String,
  date: Date,
  slideName: String,
  slides: String
}, { collection: 'slideShows' } );
slideShowSchema.virtual('action.play').get(function() {
  return '#/view/' + this.author + '/' + this.slideName;
});
slideShowSchema.set('toJSON', { virtuals: true })
module.exports = mongoose.model('SlideShow', slideShowSchema, 'slideShows');
