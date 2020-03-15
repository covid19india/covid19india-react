const express = require('express');
const router = express.Router();


router.get('/', function(req, res, next) {
  const collection = MongoDB.db('covid').collection('states');
  collection.find({}).toArray((err, states) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(states);
    }
  });
});

module.exports = router;
