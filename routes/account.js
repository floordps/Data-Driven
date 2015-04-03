var express = require('express');

module.exports.Router = function(SlideShow) {
  return express.Router()
    .get('/', function(req, res, next) {
      SlideShow.find({ username: req.session.username }, function(err, slideShows) {
        res.json(slideShows);
      });
    })
    .get('/:slidename', function(req, res, next) {
      SlideShow.findOne({
        username: req.session.username,
        slideName: req.params.slidename
      }, function(err, slideshows) {
        res.json(slideshows);
      });
    })
    .post('/:slidename', function(req, res, next) {
      SlideShow.findOne({
        username: req.session.username,
        slideName: req.params.slidename
      }, function(err, slideshows) {
        if(err) return res.json({success: false});
        if(slideshows) {
          for(var prop in req.body) {
            if(prop in slideshows) {
              slideshows[prop] = req.body[prop];
            }
          }
          //slideshows.slides = req.body.slides;
          slideshows.save();
        } else {
          new SlideShow({
            author: req.session.user.display_name,
            username: req.session.username,
            uname: req.session.user.uname,
            date: new Date(),
            slideName: req.params.slidename,
            slides: req.body.slides,
            token: req.body.token
          }).save();
        }
        res.json({success: true});
      });
    })
    .delete('/:slidename', function(req, res, next) {
      SlideShow.findOneAndRemove({
        username: req.session.username,
        slideName: req.params.slidename
      }, function(err, slideshows) {
        if(err) return res.json({success: false});
        res.json({success: true});
      });
    });
};
