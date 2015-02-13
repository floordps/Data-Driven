var express = require('express');
var app = express();
var server = app.listen(process.env.PORT || 5000);
var io = require('socket.io')(server);
var bodyParser = require('body-parser');

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.locals.pretty = true;
app.locals.basedir = __dirname;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function(req, res, next) {
  res.render('index');
});
app.get('/master', function(req, res, next) {
  res.render('master');
});
app.use('/app', express.static(__dirname + '/app'));
io.sockets.on('connection', function(socket) {
  socket.on('slidechanged', function(data) {
    socket.broadcast.emit(data.socketId, data);
  });
});
