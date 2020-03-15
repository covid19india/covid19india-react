const express = require('express');
const router = express.Router();


router.get('/', function(req, res, next) {
  return client.get('states', (err, result) => {
    if (result) {
      return res.status(200).json(JSON.parse(result));
    } else {
      const collection = MongoDB.db('covid').collection('states');
      collection.find({}).toArray((err, states) => {
        if (err) {
          res.status(500).send(err);
        } else {
          client.setex('states', 3600, JSON.stringify(states));
          res.json(states);
        }
      });
    }
  });
});

module.exports = router;
