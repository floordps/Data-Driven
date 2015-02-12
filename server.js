var express = require('express');
var app = express();
var server = app.listen(process.env.PORT || 5000);
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
app.use('/app', express.static(__dirname + '/app'));
