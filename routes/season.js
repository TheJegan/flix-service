let Season = require('../model/season');
let Episode = require('../model/episode');
const express = require('express');
let ObjectID = require('mongodb').ObjectID;
const router = express.Router();

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

router.options('/:seasonId/episodes', corsSolution, (req, res, next) => {
  console.log('options episodes');
  next();
});
// router.get('/:showId/season/:seasonId/episode', corsSolution, (req, res, next) => {
//   let episode = [{
//     _episodeId: "3755397448b24698ad223d674d1ad023",
//     _seasonId: "55210035e3a54922a797cb82365cfa57",
//     name: "Episode 1",
//     videoUrl: `http://localhost:${port}/videos/sample.mp4`,
//     createdDate: "2017-05-02T04:58:15.457Z",
//     createdBy: "789c3a53689b47bd8b6bc0bb35c5e4fc",
//     modifiedDate: "2017-05-02T04:58:15.457Z",
//     modifiedBy: "789c3a53689b47bd8b6bc0bb35c5e4fc"
//   }, {
//     _episodeId: "ede6173e24144c059e176370e9e123db",
//     _seasonId: "55210035e3a54922a797cb82365cfa57",
//     name: "Episode 2",
//     videoUrl: "http://localhost:3000/videos/sample.mp4",
//     createdDate: "2017-05-02T04:58:15.457Z",
//     createdBy: "789c3a53689b47bd8b6bc0bb35c5e4fc",
//     modifiedDate: "2017-05-02T04:58:15.457Z",
//     modifiedBy: "789c3a53689b47bd8b6bc0bb35c5e4fc"
//   }];

//   res.send(episode);
// });

router.get('/:seasonId', corsSolution, (req, res, next) => {
  let seasonId = req.params.seasonId;

  Season.find({ _id: seasonId }, (err, season) => {
    if (!err) {
      res.status(200).send(season);
    } else {
      res.status(400).send(err);
    }
  });
});

router.get('/:seasonId/episodes', corsSolution, (req, res, next) => {
  console.log('get episodes');
  let seasonId = req.params.seasonId;

  let cursor = Season.find({ _id: seasonId }, (err, season) => {
    // if (!err) {
    //   res.status(200).send(season);
    // } else {
    //   res.status(400).send(err);
    // }
  }).populate('_episodes')
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

//create episode
router.post('/:seasonId', corsSolution, (req, res, next) => {
  // let showId = req.params.showId;
  let seasonId = req.params.seasonId;
  let name = req.body.name;
  let videoUrl = req.body.videoUrl;

  let episode = new Episode({
    name: name,
    videoUrl: videoUrl,
    _season: new ObjectID(seasonId)
  });

  episode.save(err => {
    if (!err) {
      Season.findOne({ _id: seasonId }, (err, season) => {
        if (!err) {
          season._episodes.push(episode._id);
          season.save(err => {
            if (!err) {
              res.status(200).send(episode);
            } else {
              res.status(400).send(err);
            }
          });
        }
      });
    } else {
      res.status(400).send(err);
    }
  });
});

// router.delete('/:seasonId', corsSolution, (req, res, next) => {
//   Season.delete(req.params.seasonId, (err, season) => {
//     if (!err) {
//       res.status(200).send(season);
//     } else {
//       res.status(400).send(err);
//     }
//   })
// });

module.exports = router;