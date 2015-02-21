var express = require('express');
var app = express();
var server = app.listen(process.env.PORT || 5000);
var io = require('socket.io')(server);
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
/*app.get('/master', function(req, res, next) {
  res.render('master');
});*/
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
      var id = req.params.id;
      conn.analytics.report(id).execute({ details: true }, function(err, result) {
        res.json(result);
      });
    });
  });
});

app.use('/app', express.static(__dirname + '/app'));
app.use('/bower', express.static(__dirname + '/bower_components'));
io.sockets.on('connection', function(socket) {
  socket.on('slidechanged', function(data) {
    socket.broadcast.emit(data.socketId, data);
  });
});
