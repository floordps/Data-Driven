var express = require('express');
var jsforce = require('jsforce');

module.exports.Router = function(oauth2, User) {
  var fConnect = function(user) {
    var conn = new jsforce.Connection({
      oauth2: oauth2,
      instanceUrl: user.token.instanceUrl,
      accessToken: user.token.accessToken,
      refreshToken: user.token.refreshToken
    });
    conn.on('refresh', function(accessToken, res) {
      user.token.accessToken = accessToken;
    });
    return conn;
  };
  return express.Router()
    .post('/report/:id', function(req, res, next) {
      User.findOne({
        username: req.body.username
      }, function(err, user) {
        var conn = fConnect(user);
        conn.analytics.reports(function(err, reports) {
          if(err) return res.status(501).send(err);
          var id = req.params.id;
          conn.analytics.report(id).execute({ details: true }, function(err, result) {
            res.json(result);
          });
        });
      });
    })
    .post('/sob/:id', function(req, res, next) {
      User.findOne({
        username: req.body.username
      }, function(err, user) {
        var conn = fConnect(user);
        conn.query('SELECT ' + req.body.xColumn + ', ' + req.body.yColumn + ' FROM ' + req.params.id, function(err, data) {
          if(err) {console.log(err); return res.status(501).send(err);}
          res.json(data);
        });
      });
    })
    .post('/sob/:name/desc', function(req, res, next) {
      User.findOne({
        username: req.session.user.username
      }, function(err, user) {
        var conn = fConnect(user);
        conn.sobject(req.params.name).describe(function(err, data) {
          if(err) return res.status(501).send(err);
          res.json(data.fields.map(function(val) { return val.label; }));
        });
      });
    })
    .post('/report/:id/desc', function(req, res, next) {
      User.findOne({
        username: req.body.username
      }, function(err, user) {
        var conn = fConnect(user);
        conn.analytics.reports(function(err, reports) {
          var id = req.params.id;
          conn.analytics.report(id).describe(function(err, result) {
            if(err) return res.status(501).send(err);
            var details = result.reportExtendedMetadata.detailColumnInfo;
            var ret = {
              cols: [],
              name: result.reportMetadata.name
            };
            for(var o in details) {
              ret.cols.push(details[o]);
            }
            res.json(ret);
          });
        });
      });
    });};