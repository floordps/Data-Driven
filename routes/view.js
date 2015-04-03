var express = require('express');

module.exports.Router = function(SlideShow) {
  return express.Router()
    .get('/all', function(req, res, next) {
      SlideShow.find({}, '-slides', function(err, slideShows) {
        res.json(slideShows);
      });
    })
    /*.get('/:username', function(req, res, next) {
      SlideShow.find({ username: req.params.username }, function(err, slideShows) {
        res.json(slideShows);
      });
    })*/
    .get('/:username/:slidename', function(req, res, next) {
      SlideShow.findOne({
        username: req.params.username,
        slideName: req.params.slidename
      }, function(err, slideShow) {
        res.json(slideShow);
      });
    });
};
