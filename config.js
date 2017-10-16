// var redis = require('redis');
let redisPort = '6379';
let redisHost = '127.0.0.1';
var port = redisPort;
var host = redisHost;
// var client = redis.createClient(port, host);
var jwt = require('jsonwebtoken');
var q = require('q');
var User = require('./model/user');

var twitterStrategy = {
  consumerKey: process.env.TwitterKey,
  consumerSecret: process.env.TwitterSecret,
  callback: process.env.TwitterCallback
}

var googleStrategy = {
  consumerKey: process.env.GoogleKey,
  consumerSecret: process.env.GoogleSecret,
  callback: process.env.GoogleCallback
}

var config = {
  twitter: twitterStrategy,
  google: googleStrategy,
  mongooseURL: process.env.MongooseLocal,
  UIAddr: process.env.UIAddr,
  isAuthenticated: (req, res, next) => {

    let token = req.headers.authorization;

    if (!token) {
      console.log('is not isAuthenticated');
      return res.status(401).send({ 'statusCode': '-1' });
    }

    q.fcall(() => {
      let defer = q.defer();
      jwt.verify(token, config.AUTH_TOKEN_SECRET, (err, payload) => {
        if (err) {
          console.log(err);
          res.status(400).send("error occured validating token");
        } else {
          console.log(payload);
          // return payload.userId;
          defer.resolve(payload.userId);
        }
      });

      return defer.promise;
    }).then((userId) => {
      console.log(`user set ${userId}`);
      User.findOne({ _id: userId }, (err, u) => {
        if (!err) {
          // req.user = u;
          res.locals.user = u;
          next();
        }
      })

    })

  },
  isAdmin: (req, res, next) => {
    req.user = res.locals.user;
    if (req.user.role === 'admin') {
      next();
    } else {
      console.log('not authorized');
      return res.status(401).send({ 'statusCode': '-1' });
    }
  },
  redis: {
    port: port,
    host: host
  },
  AUTH_TOKEN_SECRET: 'Without an edges'
}


module.exports = config;