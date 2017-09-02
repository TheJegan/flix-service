const express = require('express');
const router = express.Router();

let corsSolution = (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,contenttype'); // If needed
  res.setHeader('Access-Control-Allow-Credentials', true); // If needed

  next();
}

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

module.exports = router;