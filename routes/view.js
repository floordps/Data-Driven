var express = require('express');

module.exports.Router = function(SlideShow) {
  return express.Router()
    .get('/all', function(req, res, next) {
      SlideShow.find({}, '-slides -multiplex', function(err, slideShows) {
        res.json(slideShows);
      });
    })
    .get('/:username/:slidename', function(req, res, next) {
      SlideShow.findOne({
        username: req.params.username,
        slideName: req.params.slidename
      }, '-multiplex.secret', function(err, slideShow) {
        res.json(slideShow);
      });
    });
};
