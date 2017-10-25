var mongoose = require('mongoose');
var express = require('express');
var router = express.Router();
var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;
var GoogleStrategy = require('passport-google-oauth2').Strategy;
var LocalStrategy = require('passport-local').Strategy;
var env = require('../config');
var User = require('../model/user');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
// var redis = require('redis');
// var port = env.redis.port;
// var host = env.redis.host;
// var client = redis.createClient(port, host);


const serverUrl = env.UIAddr;
//Implement passport
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

passport.use(new TwitterStrategy({
  consumerKey: env.twitter.consumerKey, //env.config.twitter.consumerKey,
  consumerSecret: env.twitter.consumerSecret, //'MGdqxBUI0lLoLc7KZYnW0xRNPAfpUL9diWFLU559lA', //env.config.twitter.consumerKey,
  callbackURL: env.twitter.callback
},
  function (token, tokenSecret, profile, done) {
    console.log('profile');
    console.log('token: ' + token);
    console.log('tokenSecret: ' + tokenSecret);
    console.log('profile: ' + profile);
    console.log('done: ' + done);
    console.log(profile);

    //store token
    console.log('profile id' + profile.id);

    // client.set(tokenSecret, profile.id);

    //todo: if twitter profile change, update
    User.findOne({ oauthID: profile.id }, function (err, user) {
      if (err) { console.log(err); }
      let responseMsg = {
        token: token,
        profileId: "",
        displayName: profile.displayName
      };


      if (!err && user != null) {
        responseMsg.profileId = user._id;
        done(null, responseMsg);
      }
      else {
        //log where u are authenticating from.
        //e.g authType: twitter
        var user = new User({
          oauthID: profile.id,
          username: profile.username,
          displayName: profile.displayName,
          created: Date.now()
        });


        user.save(function (err) {
          if (err) {
            console.log(err);
          } else {
            responseMsg.profileId = user._id;
            responseMsg.displayName = user.displayName;
            console.log("saving user ...");

            // client.set(responseMsg.token, user._id);

            done(null, responseMsg);
          }
        });

      }
    });
  }
));

//make object oriented
passport.use(new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  session: false,
  passReqToCallback: true,
},
  function (req, username, password, done) {

    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }



      bcrypt.hash(password, user.salt, function (err, hash) {
        // Store hash in your password DB.
        if (user.password === hash) {
          let payload = {
            userId: user._id
          }
          let token = jwt.sign(payload, env.AUTH_TOKEN_SECRET, { expiresIn: '4h' });

          let auth = {
            token: token,
            // profileId: user._id,
            displayName: user.displayName,
            role: user.role
          };

          return done(null, auth);
        } else {
          return done({msg: 'unauthorize'})
        }
      })
    });
  }
));

passport.use(new GoogleStrategy({
  clientID: env.google.consumerKey,
  clientSecret: env.google.consumerSecret,
  callbackURL: env.google.callback,
  passReqToCallback: true
},
  function (token, tokenSecret, profile, done) {
    console.log('profile');
    console.log('token: ' + token);
    console.log('tokenSecret: ' + tokenSecret);
    console.log('profile: ' + profile);
    console.log('done: ' + done);

    //todo: if twitter profile change, update
    User.findOne({ oauthID: profile.id }, function (err, user) {
      if (err) { console.log(err); }

      if (!err && user != null) {
        done(null, user);
      }
      else {
        //log where u are authenticating from.
        //e.g authType: twitter
        var user = new User({
          oauthID: profile.id,
          username: profile.username,
          displayName: profile.displayName,
          created: Date.now()
        });

        var auth = {
          token: token,
          profileId: profile.id
        };

        user.save(function (err) {
          if (err) {
            console.log(err);
          } else {
            console.log("saving user ...");
            done(null, user);
          }
        });

      }
    });
  }
));
//end implement passport


let corsSolution = (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,contenttype,origin, content-type, accept, authorization'); // If needed
  res.setHeader('Access-Control-Allow-Credentials', true); // If needed

  next();
}

router.options('/login', corsSolution, (req, res, next) => {
  next();
});

router.post('/login', corsSolution,
  passport.authenticate('local', {
    failureRedirect: '/login'
  }), (req, res) => {
    // console.log(req.user);
    console.log('done');

    res.status(200).send(req.user); //passport.done assigns to user object
  });


router.get('/twitter', passport.authenticate('twitter'));

router.get('/twitter/callback',
  passport.authenticate('twitter', {
    failureRedirect: '/fail'
  }), (req, res) => {
    // console.log(req.user);
    let token = req.user.token;
    let profileId = req.user.profileId;
    let displayName = req.user.displayName;
    let redirectUrl = `${serverUrl}/loginsuccess;token=${token};profile_id=${profileId};displayName=${displayName}`;

    res.redirect(redirectUrl);

  });

router.get('/google', passport.authenticate('google'));

router.get('/google/callback',
  passport.authenticate('google', {
    successRedirect: serverUrl,
    failureRedirect: '/fail'
  }));


router.get('/logout', corsSolution, (req, res, next) => {
  req.session.destroy();
  req.logout();
  res.status(200).send({ msg: "success never smelled so sweet" });
})


module.exports = router;
