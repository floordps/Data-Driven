var express = require('express');
var SlideShow = require('../models/slideShow');

module.exports.Router = function() {
  return express.Router()    .get('/:id', function(req, res, next) {      var q = SlideShow.where({ id: req.params.id });      q.findOne(function(err, slide) {        res.json(slide);      });    })    .post('/:id', function(req, res, next) {      var q = SlideShow.where({ id: req.params.id });      q.findOne(function(err, slide) {        if(err) return res.status(500).send(err);        if(slide) {          slide.slides = req.body.slides;          slide.save();        }        else {          new SlideShow({ id: req.params.id, slides: req.body.slides }).save();        }      });    });};