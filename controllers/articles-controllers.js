const { fetchArticle, fetchArticles, updateArticle } = require('../models/articles-models')

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

exports.patchArticle = (req, res, next) => {
    const { article_id } = req.params
    const { inc_votes } = req.body
    updateArticle(article_id, inc_votes) 
    .then((updatedArticle) => {
        res.status(200).send({updatedArticle: updatedArticle})
    })
    .catch(next)
}