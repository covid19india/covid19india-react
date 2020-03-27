const express = require('express')
// eslint-disable-next-line new-cap
const router = express.Router()

router.get('/', function (req, res, next) {
  // eslint-disable-next-line no-undef
  return client.get('states', (err, result) => {
    if (result) {
      return res.status(200).json(JSON.parse(result))
    } else {
      // eslint-disable-next-line no-undef
      const collection = MongoDB.db('covid').collection('states')
      collection.find({}).toArray((err, states) => {
        if (err) {
          res.status(500).send(err)
        } else {
          // eslint-disable-next-line no-undef
          client.setex('states', 3600, JSON.stringify(states))
          res.json(states)
        }
      })
    }
  })
})

module.exports = router
