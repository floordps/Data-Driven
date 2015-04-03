var express = require('express');

module.exports.Router = function(SlideShow) {
  return express.Router()
    .get('/', function(req, res, next) {
      SlideShow.find({ username: req.session.user.username }, function(err, slideShows) {
        res.json(slideShows);
      });
    })
    .get('/:slidename', function(req, res, next) {
      SlideShow.findOne({
        username: req.session.user.username,
        slideName: req.params.slidename
      }, function(err, slideshows) {
        res.json(slideshows);
      });
    })
    .post('/:slidename', function(req, res, next) {
      SlideShow.findOne({
        username: req.session.user.username,
        slideName: req.params.slidename
      }, function(err, slideshows) {
        if(err) return res.json({success: false});
        var slide = null;
        if(slideshows) {
          for(var prop in req.body) {
            if(prop in slideshows) {
              slideshows[prop] = req.body[prop];
            }
          }
          //slideshows.slides = req.body.slides;
          slideshows.save();
        } else {
          slide = new SlideShow({
            author: req.session.user.display_name,
            username: req.session.user.username,
            date: new Date(),
            slideName: req.params.slidename,
            slides: req.body.slides,
            token: req.body.token
          });
          slide.save();
        }
        res.json({slideshow: slide, success: true});
      });
    })
    .delete('/:slidename', function(req, res, next) {
      SlideShow.findOneAndRemove({
        username: req.session.user.username,
        slideName: req.params.slidename
      }, function(err, slideshows) {
        if(err) return res.json({success: false});
        res.json({success: true});
      });
    });
};
