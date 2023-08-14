const express = require('express')
const app = express()
const { getTopics } = require('./controllers/topics-controllers')
const { getEndpoints } = require('./controllers/general-controllers')

app.get('/api/topics', getTopics)

app.get('/api', getEndpoints)

app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).send({ msg: 'Internal Server Error' });
  });

  module.exports = app