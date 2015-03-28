var express = require('express');

module.exports.Router = function(SlideShow) {
  return express.Router()
    .get('/', function(req, res, next) {
      SlideShow.find({ username: req.user.username }, function(err, slideShows) {
        res.json(slideShows);
      });
    })
    .get('/:slidename', function(req, res, next) {
      SlideShow.findOne({
        username: req.user.username,
        slideName: req.params.slidename
      }, function(err, slideshows) {
        res.json(slideshows);
      });
    })
    .post('/:slidename', function(req, res, next) {
      SlideShow.findOne({
        username: req.user.username,
        slideName: req.params.slidename
      }, function(err, slideshows) {
        if(err) return res.json({success: false});
        if(slideshows) {
          for(var prop in req.body) {
            console.log(prop);
            if(prop in slideshows) {
            console.log('g');
              slideshows[prop] = req.body[prop];
            }
          }
          //slideshows.slides = req.body.slides;
          slideshows.save();
        } else {
          new SlideShow({
            author: req.user.profile.displayName,
            username: req.user.username,
            date: new Date(),
            slideName: req.params.slidename,
            slides: req.body.slides
          }).save();
        }
        res.json({success: true});
      });
    })
    .delete('/:slidename', function(req, res, next) {
      SlideShow.findOneAndRemove({
        username: req.user.username,
        slideName: req.params.slidename
      }, function(err, slideshows) {
        if(err) return res.json({success: false});
        res.json({success: true});
      });
    });
};
