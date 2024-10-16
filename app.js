const express = require('express')
const app = express()
const { getTopics, getApi, getArticleById, getArticles, getCommentsByArticleId } = require('./MVC/controller.js')
const endpoints = require('./endpoints.json')


app.get('/api/topics', getTopics)

app.get('/api', getApi)

app.get('/api/articles/:article_id', getArticleById)

app.get('/api/articles', getArticles)

app.get('/api/articles/:article_id/comments', getCommentsByArticleId)

app.use((err, req, res, next) => {
    if (err.code === '22P02') {
        res.status(400).send({ msg: 'Invalid data type' })
    } else next(err)
})

app.use((err, req, res, next) => {
    if (err.status === 404) {
        res.status(404).send({ msg: 'Not found' })
    } else next(err)
})

app.use((err, req, res, next) => {
    res.status(500).send({ msg: 'Internal server error' })
})



module.exports = app