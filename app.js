const express = require('express')
const app = express()
const { getTopics } = require('./controllers/topics-controllers')
const { getArticle, getArticles } = require('./controllers/articles-controllers')
const {getEndpoints} = require('./controllers/general-controllers')

app.use()

app.get('/api/topics', getTopics)

app.get('/api/articles/:article_id', getArticle)

app.get('/api', getEndpoints)

app.get('/api/articles', getArticles)

app.post()

app.use((err, req, res, next) => {
  if(err.code === '22P02'){
    res.status(400).send({msg: 'bad request'})
  } else next(err)
})

app.use((err, req, res, next) => {
  if(err.status && err.msg){
    res.status(err.status).send({msg: err.msg})
  } else next(err)
})


app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).send({ msg: 'Internal Server Error' });
  });

  module.exports = app