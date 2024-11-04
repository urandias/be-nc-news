const express = require('express')
const app = express()
const { getTopics, getApi, getArticleById, getArticles, getCommentsByArticleId, postCommentsByArticleId, patchArticleById, deleteCommentsById, getAllUsers
} = require('./MVC/controller.js')
const endpoints = require('./endpoints.json')
const cors = require('cors');
app.use(cors());

app.use(express.json())

app.get('/api/topics', getTopics)

app.get('/api', getApi)

app.get('/api/articles/:article_id', getArticleById)

app.get('/api/articles', getArticles)

app.get('/api/articles/:article_id/comments', getCommentsByArticleId)

app.post('/api/articles/:article_id/comments', postCommentsByArticleId)

app.patch('/api/articles/:article_id', patchArticleById)

app.delete('/api/comments/:comment_id', deleteCommentsById)

app.get('/api/users', getAllUsers)


app.use((err, req, res, next) => {
    if (err.code === '22P02') {
        res.status(400).send({ msg: 'Invalid data type' })
    } else next(err)
})

app.use((err, req, res, next) => {
    if (err.status && err.msg) {
        res.status(err.status).send({ msg: err.msg })
    } else next(err)
})

app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).send({ msg: 'Internal server error' })
})



module.exports = app