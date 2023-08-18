const { getArticles, getArticle, patchArticle, postArticle } = require('../controllers/articles-controllers')
const { getCommentsByArticle, postComment } = require('../controllers/comments-controllers')

const  articlesRouter = require('express').Router()


articlesRouter
.route('/')
.get(getArticles)
.post(postArticle)

articlesRouter
.route('/:article_id')
.get(getArticle)
.patch(patchArticle)

articlesRouter
.route('/:article_id/comments')
.get(getCommentsByArticle)
.post(postComment)

module.exports = {articlesRouter}