const express = require('express');
const router = express.Router();
let Episode = require('../model/episode');
let env = require('../config');

let corsSolution = (req, res, next) => {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,contenttype,origin, content-type, accept, authorization'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed

    next();
}

router.options('/', corsSolution, (req, res, next) => {
  next();
});
router.options('/:id', corsSolution, (req, res, next) => {
  console.log('options called');
  next();
});


router.get('/', corsSolution, (req, res, next) => {

  let framework;

  //  = client.get('framework');
  // client.get('framework', (err, data) => {
  //   framework = data;
  //   if (err) {
  //     return res.send(err);
  //   }
  //    return res.send(framework);

  // });

  res.send("works");


});

router.post('/', corsSolution, (req, res, next) => {

});


router.delete('/:episodeId', env.isAuthenticated, env.isAdmin, corsSolution, (req, res, next) => {
  console.log('deleting episode ');
  console.log(req.params.episodeId);
  Episode.find({ _id: req.params.episodeId }, (err, episode) => {
    if (!err) {
      res.status(200).send(episode[0]);
    } else {
      res.status(400).send(err);
    }
  }).remove().exec();
});

module.exports = router;