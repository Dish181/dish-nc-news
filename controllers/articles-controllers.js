const { fetchArticle, fetchArticles, updateArticle, createArticle } = require('../models/articles-models')

exports.getArticle = (req, res, next) => {
    const {article_id} = req.params
    fetchArticle(article_id)
    .then((article) => {
        res.status(200).send({'article': article})
    })
    .catch(next)
}

exports.getArticles = (req, res, next) => {
    const {topic, sort_by, order} = req.query
    fetchArticles(topic, sort_by, order)
    .then((articles) => {
        res.status(200).send({articles: articles})
    })
    .catch(next)
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

exports.postArticle = (req, res, next) => {
    const {author, title, body, topic, article_img_url} = req.body
    createArticle(author, title, body, topic, article_img_url)
    .then((article_id) => {
       return fetchArticle(article_id)
    })
    .then((article) => {
        res.status(200).send({createdArticle: article})
    })
    .catch(next)
}