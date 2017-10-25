var express = require('express');
var router = express.Router();
const User = require('../model/user');
// var redis = require('redis');
var config = require('../config');
// var client = redis.createClient(config.redis.port, config.redis.host);
var helpers = require("../helpers");
var guid = require('../guid');
const saltRounds = 10;
var bcrypt = require('bcrypt');

let corsSolution = (req, res, next) => {

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,contenttype,origin, content-type, accept, authorization'); // If needed
  res.setHeader('Access-Control-Allow-Credentials', true); // If needed

  next();
}

/* GET users listing. */
router.get('/', corsSolution, config.isAuthenticated, config.isAdmin, function (req, res, next) {
  // res.send()
  // client.set('framework', 'AngularJS');

  console.log('is authenticated');
  console.log(req.user);
  console.log('is authenticated 2');
  console.log(req.session);
  // User.find({}, (err, u) => {
  //   if (!err) {
  //     res.status(200).send(u);
  //   } else {
  //     res.status(400).send(err);
  //   }
  // });
  User.findAll().then(users => {
    res.status(200).send(users);
  }, err => {
    res.status(500).send(err);
  });

});

router.get('/me', corsSolution, config.isAuthenticated, function (req, res, next) {
  let user = res.locals.user;

  console.log('users');
  console.log(user);

  res.status(200).send(user);
});

router.get('/:id', corsSolution, function (req, res, next) {

  // User.findOne({ _id: userId }, (err, u) => {
  //   if (!err) {
  //     res.status(200).send(u);
  //   } else {
  //     res.status(400).send(err);
  //   }
  // })
});

router.options('/', corsSolution, (req, res, next) => {
  next();
});

router.options('/:id', corsSolution, (req, res, next) => {
  next();
});

router.put('/:id', corsSolution, (req, res, next) => {
  // let userId = req.params.id;
  // let user = req.body;
  // User.update({ _id: userId }, user, (err, u) => {
  //   if (!err) {
  //     res.status(200).send(u);
  //   } else {
  //     res.status(400).send(err);
  //   }
  // });
});

router.post('/', corsSolution, (req, res, next) => {
  console.log('entering users')
  let username = req.body.username;
  let displayName = req.body.displayName;
  let password = req.body.password;
  let confirm = req.body.confirm;

  if (password !== confirm) {
    res.status(400).send({ msg: 'password not match' });
    return;
  }

  if (!username || !password || !confirm || !displayName) {
    res.status(400).send({ msg: `can't be null` });
    return;
  }



  bcrypt.genSalt(saltRounds, function (err, salt) {
    bcrypt.hash(password, salt, function(err, hash) {
        // Store hash in your password DB.
      console.log('hash');
        console.log(hash);

        let user = {
          username: req.body.username,
          password: hash,
          displayName: req.body.displayName,
          salt: salt
        };

        User.create(user, (err, u) => {
          if (!err) {
            res.send(u)
          } else {
            res.send(err);
          }
        });
    });
  });
});

module.exports = router;
