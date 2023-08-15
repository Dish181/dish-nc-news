const {fetchCommentsByArticle} = require('../models/comments-models')
const {fetchArticle} = require('../models/articles-models')

exports.getCommentsByArticle = (req, res, next) => {
    const {article_id} = req.params
    const promises = [fetchCommentsByArticle(article_id), fetchArticle(article_id)]

    Promise.all(promises)
    .then((resolvedPromises) => {
        res.status(200).send({comments: resolvedPromises[0]})
    })
    .catch(next)
}