'use strict';
const express = require('express');
const router = express.Router();
let User = require('../model/user');
var port = process.env.PORT || '3000';
let Show = require('../model/show');
let Season = require('../model/season');
let Episode = require('../model/episode');
let ObjectID = require('mongodb').ObjectID;
let q = require('q');
var env = require('../config');


let corsSolution = (req, res, next) => {

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,contenttype,origin, content-type, accept, authorization'); // If needed
  res.setHeader('Access-Control-Allow-Credentials', true); // If needed

  next();
}

router.options('/', corsSolution, (req, res, next) => {
  next();
})

router.options('/:id', corsSolution, (req, res, next) => {
  next();
});

router.delete('/:id', corsSolution, (req, res, next) => {

  Show.find({ _id: req.params.id }, (err, show)=>{
    if (!err) {
      res.status(200).send(episode[0]);
    } else {
      res.status(400).send(err);
    }
  }).remove().exec();
});

router.get('/', env.isAuthenticated, corsSolution, (req, res, next) => {
  console.log('getting shows');

  Show.find({}, (err, shows) => {
    if (!err) {
      res.status(200).send(shows)
    } else {
      res.status(400).send(err);
    }
  });
  // console.log('is auth');
  // console.log(req.user);
  // console.log(req.isAuthenticated());

  // let show = [{
  //   _id: "e01a23b7aa9a4ce384b8571bfcb98bcf",
  // name: "Power",
  // coverUrl: "http://www.rapbasement.com/wp-content/uploads/2014/06/download-1.jpeg",
  // description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting",
  //   seasons: [
  //     {
  //       _seasonId: "55210035e3a54922a797cb82365cfa57"
  //     },
  //     {
  //       _seasonId: "58772940f36d284ed5893150"
  //     }
  //   ],
  //   createdDate: "2017-05-02T04:58:15.457Z",
  //   createdBy: "789c3a53689b47bd8b6bc0bb35c5e4fc",
  //   modifiedDate: "2017-05-02T04:58:15.457Z",
  //   modifiedBy: "789c3a53689b47bd8b6bc0bb35c5e4fc",
  // }, {
  //   _id: "e01a23b7aa9a4ce384b8571bfcb98bcf",
  //   name: "totally different show",
  //   coverUrl: "http://www.rapbasement.com/wp-content/uploads/2014/06/download-1.jpeg",
  //   description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting",
  //   seasons: [
  //     {
  //       _seasonId: "55210035e3a54922a797cb82365cfa57"
  //     },
  //     {
  //       _seasonId: "58772940f36d284ed5893150"
  //     }
  //   ],
  //   createdDate: "2017-05-02T04:58:15.457Z",
  //   createdBy: "789c3a53689b47bd8b6bc0bb35c5e4fc",
  //   modifiedDate: "2017-05-02T04:58:15.457Z",
  //   modifiedBy: "789c3a53689b47bd8b6bc0bb35c5e4fc",
  // }];

  // res.send(show);
});

//create show
router.post('/', env.isAuthenticated, corsSolution, (req, res, next) => {
  let name = req.body.name;
  let description = req.body.description;
  let coverUrl = req.body.coverUrl;
  let user = res.locals.user;
  // let user = req.user._id || '';
  // let episode = req.body.episode;

  let show = new Show({
    name: name,
    description: description,
    coverUrl: coverUrl,
    createdBy: user._id
  });

  show.save(err => {
    if (!err) {
      res.status(200).send(show);
    } else {
      res.status(400).send(err);
    }
  });
});

router.get('/:showId', env.isAuthenticated, corsSolution, (req, res, next) => {
  let showId = req.params.showId;
  console.log(`show id: ${showId}`)

  if (!showId) {
    return res.status(400).send({ msg: 'show id cannot be null' });
  }

  let cursor = Show.find({ _id: showId }).populate('_seasons')
    .cursor();

  cursor.next(function (err, show) {
    // console.log(doc);
    if (!err) {
      res.status(200).send(show);
    } else {
      res.status(400).send(err);
    }
  });
});


//create season
router.post('/:showId', env.isAuthenticated, corsSolution, (req, res, next) => {
  let name = req.body.name;
  let coverUrl = req.body.coverUrl;
  let description = req.body.description;
  let _showId = req.params.showId;

  let season = new Season({
    name: name,
    _show: new ObjectID(_showId),
    description: description,
    coverUrl: coverUrl
  });

  Show.findOne({ _id: _showId }, (err, show) => {
    season.save(err => {
      if (!err) {
        show._seasons.push(season._id);
        show.save(err => {
          if (!err) {
            res.status(200).send(season);
          } else {
            res.status(400).send(err);
          }
        });
      }
    })
  });
});

// function addSeasonToShow(seasonId)

//create episode
router.post('/:showId/seasons/:seasonId', env.isAuthenticated, corsSolution, (req, res, next) => {
  // let showId = req.params.showId;
  let seasonId = req.params.seasonId;
  let name = req.body.name;
  let videoUrl = req.body.videoUrl;

  let episode = new Episode({
    name: name,
    videoUrl: videoUrl,
    // showId: new ObjectID(showId),
    _season: new ObjectID(seasonId)
  });

  episode.save(err => {
    if (!err) {
      Season.findOne({ _id: seasonId }, (err, season) => {

        season._episode.push(episode._id);
        season.save(err => {
          if (!err) {
            res.status(200).send(episode);
          } else {
            res.status(400).send(err);
          }
        });

      });

    } else {
      res.status(400).send(err);
    }
  });
});



router.get('/:showId/seasons', env.isAuthenticated, corsSolution, (req, res, next) => {
  let showId = req.params.showId;
  Season.find({ _showId: showId }, (err, seasons) => {
    if (!err) {
      res.status(200).send(seasons);
    } else {
      res.status(400).send(err);
    }
  });
});

router.get('/:showId/seasons/:seasonId', corsSolution, (req, res, next) => {

  let season = {
    _seasonId: "55210035e3a54922a797cb82365cfa57",
    _showId: "e01a23b7aa9a4ce384b8571bfcb98bcf",
    name: "Power Season 1",
    coverUrl: "http://www.rapbasement.com/wp-content/uploads/2014/06/download-1.jpeg",
    description: "Season 1 Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting",
    episodes: [
      {
        _episodeId: "55210035e3a54922a797cb82365cfa57"
      }
    ],
    createdDate: "2017-05-02T04:58:15.457Z",
    createdBy: "789c3a53689b47bd8b6bc0bb35c5e4fc",
    modifiedDate: "2017-05-02T04:58:15.457Z",
    modifiedBy: "789c3a53689b47bd8b6bc0bb35c5e4fc"
  };

  res.send(season);
});

router.get('/:showId/seasons/:seasonId/episode', corsSolution, (req, res, next) => {
  let episode = [{
    _episodeId: "3755397448b24698ad223d674d1ad023",
    _seasonId: "55210035e3a54922a797cb82365cfa57",
    name: "Episode 1",
    videoUrl: `http://localhost:${port}/videos/sample.mp4`,
    createdDate: "2017-05-02T04:58:15.457Z",
    createdBy: "789c3a53689b47bd8b6bc0bb35c5e4fc",
    modifiedDate: "2017-05-02T04:58:15.457Z",
    modifiedBy: "789c3a53689b47bd8b6bc0bb35c5e4fc"
  }, {
    _episodeId: "ede6173e24144c059e176370e9e123db",
    _seasonId: "55210035e3a54922a797cb82365cfa57",
    name: "Episode 2",
    videoUrl: `http://localhost:${port}/videos/sample.mp4`,
    createdDate: "2017-05-02T04:58:15.457Z",
    createdBy: "789c3a53689b47bd8b6bc0bb35c5e4fc",
    modifiedDate: "2017-05-02T04:58:15.457Z",
    modifiedBy: "789c3a53689b47bd8b6bc0bb35c5e4fc"
  }];

  res.send(episode);
});

router.get('/:showId/seasons/:seasonId/episode/:episodeId', (req, res, next) => {
  let episode = {
    _episodeId: "3755397448b24698ad223d674d1ad023",
    _seasonId: "55210035e3a54922a797cb82365cfa57",
    name: "Episode 1",
    videoUrl: `http://localhost:${port}/videos/sample.mp4`,
    createdDate: "2017-05-02T04:58:15.457Z",
    createdBy: "789c3a53689b47bd8b6bc0bb35c5e4fc",
    modifiedDate: "2017-05-02T04:58:15.457Z",
    modifiedBy: "789c3a53689b47bd8b6bc0bb35c5e4fc"
  };

  res.send(episode);
});
module.exports = router;