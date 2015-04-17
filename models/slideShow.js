var mongoose = require('mongoose');
var slideShowSchema = new mongoose.Schema({
  reveal: {
    controls: { type: Boolean, default: true },
    progress: { type: Boolean, default: true },
    slideNumber: { type: Boolean, default: false },
    history: { type: Boolean, default: false },
    keyboard: { type: Boolean, default: true },
    overview: { type: Boolean, default: true },
    center: { type: Boolean, default: true },
    touch: { type: Boolean, default: true },
    loop: { type: Boolean, default: false },
    rtl: { type: Boolean, default: false },
    help: { type: Boolean, default: true },
    autoSlide: { type: Number, default: 0 },
    autoSlideStoppable: { type: Boolean, default: true },
    mousewheel: { type: Boolean, default: false },
    transition: { type: String, default: 'default' },
    backgroundTransition: { type: String, default: false },
    viewDistance: { type: Number, default: 3 }
  },
  multiplex: {
    secret: String,
    id: String
  },
  author: String,
  username: String,
  date: Date,
  slideName: String,
  slides: String
}, { collection: 'slideShows' } );
module.exports = mongoose.model('SlideShow', slideShowSchema, 'slideShows');
