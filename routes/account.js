var express = require('express');
var crypto = require('crypto');
var hash = function(secret) {
	var sha1 = crypto.createHash('sha1');
	return sha1.update(secret.toString()).digest('hex');
};

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
        var slide = null,
          secret = +new Date() + Math.floor(Math.random()*9999999);
        if(slideshows) {
          for(var prop in req.body) {
            if(prop in slideshows) {
              slideshows[prop] = req.body[prop];
            }
          }
          slide = slideshows;
          slideshows.save();
        } else {
          slide = new SlideShow({
            author: req.session.user.display_name,
            username: req.session.user.username,
            date: new Date(),
            slideName: req.params.slidename,
            slides: req.body.slides,
            token: req.body.token,
            multiplex: {
              secret: secret,
              id: hash(secret)
            }
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
