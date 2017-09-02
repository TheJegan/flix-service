const express = require('express');
const router = express.Router();

let corsSolution = (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,contenttype'); // If needed
  res.setHeader('Access-Control-Allow-Credentials', true); // If needed

  next();
}

router.get('/', corsSolution, (res, req, next) => {
  res.status(200).send({});
})

module.exports = router;