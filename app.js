const express = require('express')
const app = express()
const { getTopics, getApi, getArticleById } = require('./MVC/controller.js')
const endpoints = require('./endpoints.json')


app.get('/api/topics', getTopics)

app.get('/api', getApi)

app.get('/api/articles/:article_id', getArticleById)

app.use((err, req, res, next) => {
    if (err.code === '22P02') {
        res.status(400).send({ msg: 'Invalid data type' })
    } else next(err)
})

app.use((err, req, res, next) => {
    res.status(500).send({ msg: 'Internal server error' })
})



module.exports = app