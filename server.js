var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var users = require('./routes/users');
var show = require('./routes/show');
var season = require('./routes/season');
var movies = require('./routes/movies');
var passport = require('passport');
var twitterStrategy = require('passport-twitter');
var auth = require('./routes/auth');
var session = require('express-session');
var episode = require('./routes/episode');
var config = require('./config');
var mongoose = require('mongoose');
var app = express();
var swaggerJSDoc = require('swagger-jsdoc');
// var redis = require('redis');

//swagger ui initialiization
// swagger definition
var swaggerDefinition = {
  info: {
    title: 'Node Swagger API',
    version: '1.0.0',
    description: 'Demonstrating how to describe a RESTful API with Swagger',
  },
  host: 'localhost:3000',
  basePath: '/',
};

// options for the swagger docs
var options = {
  // import swaggerDefinitions
  swaggerDefinition: swaggerDefinition,
  // path to the API docs
  apis: ['./routes/*.js'],
};

var swaggerSpec = swaggerJSDoc(options);
//swagger ui initialization

app.use(session({ secret: 'topsecret', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());


mongoose.connect(config.mongooseURL);
// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api/users', users);
app.use('/api/episodes', episode);
app.use('/api/shows', show);
app.use('/api/seasons', season);
app.use('/api/movies', movies);
app.use('/auth', auth);



// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');

  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  err.status = 404;
  next(err);
});

app.get('/swagger.json', function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    // res.render('error', {
    //   message: err.message,
    //   error: err
    // });
    console.log(err);
    console.log(`\n\n\nmessage: ${err.message}`)
  });
}

// serve swagger

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  // res.render('error', {
  //   message: err.message,
  //   error: {}
  // });
  console.log(err);
  console.log(`\n\n\nmessage: ${err.message}`)
});


module.exports = app;
