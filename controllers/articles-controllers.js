const { fetchArticle } = require('../models/articles-models')

exports.getArticle = (req, res, next) => {
    const {article_id} = req.params
    fetchArticle(article_id)
    .then((article) => {
        res.status(200).send({'article': article})
    })
    .catch(next)
}