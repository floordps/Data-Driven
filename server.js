var express = require('express');
var app = express();
var server = app.listen(process.env.PORT || 5000);
var io = require('socket.io')(server);
var socket = require('./routes/socket.js');
var bodyParser = require('body-parser');
var jsforce = require('jsforce');

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.locals.pretty = true;
app.locals.basedir = __dirname;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function(req, res, next) {
  res.render('index');
});
app.get('/partials/:id', function(req, res, next) {
  res.render('partials/' + req.params.id);
});

var js = require('./jsConnect.json');
app.post('/report/:id', function(req, res, next) {
  var conn = new jsforce.Connection({
    oauth2: {
      clientId: js.clientId,
      clientSecret: js.clientSecret,
      redirectUri: js.redirectUri
    }
  });
  conn.login(js.username, js.password, function(err, user) {
    if(err) return res.status(500).send(err);
    conn.analytics.reports(function(err, reports) {
      if(err) return res.status(501).send(err);
      var id = req.params.id;
      conn.analytics.report(id).execute({ details: true }, function(err, result) {
        res.json(result);
      });
    });
  });
});
app.post('/report/:id/desc', function(req, res, next) {
  var conn = new jsforce.Connection({
    oauth2: {
      clientId: js.clientId,
      clientSecret: js.clientSecret,
      redirectUri: js.redirectUri
    }
  });
  conn.login(js.username, js.password, function(err, user) {
    if(err) return res.status(500).send(err);
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
});

app.use('/app', express.static(__dirname + '/app'));
app.use('/bower', express.static(__dirname + '/bower_components'));
io.sockets.on('connection', socket);
