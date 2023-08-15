const { response } = require('../app')
const { fetchArticle, fetchArticles } = require('../models/articles-models')

exports.getArticle = (req, res, next) => {
    const {article_id} = req.params
    fetchArticle(article_id)
    .then((article) => {
        res.status(200).send({'article': article})
    })
    .catch(next)
}

exports.getArticles = (req, res, next) => {
    fetchArticles()
    .then((articles) => {
        res.status(200).send({articles: articles})
    })
}