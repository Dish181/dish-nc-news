const {fetchCommentsByArticle, insertComment, removeComment, updateComment} = require('../models/comments-models')
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

exports.postComment = (req, res, next) => {
    const comment = req.body
    const {article_id} = req.params
    insertComment(comment, article_id)
    .then((postedComment) => {
        res.status(201).send({postedComment: postedComment})
    })
    .catch(next)
}

exports.deleteComment = (req, res, next) => {
    const {comment_id} = req.params
    removeComment(comment_id)
    .then(() => {
        res.status(204).send()
    })
    .catch(next)
}

exports.patchComment = (req, res, next) => {
    const {inc_votes} = req.body
    const {comment_id} = req.params
    updateComment(inc_votes, comment_id)
    .then((updatedComment) => {
        res.status(200).send({updatedComment: updatedComment})
    })
    .catch(next)
}