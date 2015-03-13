var express = require('express');
var SlideShow = require('../models/slideShow');

module.exports.Router = function() {
  return express.Router()    .get('/:slidename', function(req, res, next) {      var q = SlideShow.where({ name: req.params.username });      q.findOne(function(err, user) {        res.json(user.slideshows);      });    })    .get('/:username/:slidename', function(req, res, next) {      var q = SlideShow.where({        name: req.params.username,        'slideshows.slideName': req.params.slidename      });      q.findOne(function(err, slide) {        res.json(slide);      });    });    /*.post('/:slidename', function(req, res, next) {      var q = SlideShow.where({ slideName: req.params.slidename });      q.findOne(function(err, slide) {        if(err) return res.status(500).send(err);        if(slide) {          slide.slides = req.body.slides;          slide.save();        }        else {          new SlideShow({ id: req.params.id, slides: req.body.slides }).save();        }      });    });*/};