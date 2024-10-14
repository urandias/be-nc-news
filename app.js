const express = require('express')
const app = express()
const { getTopics } = require('./MVC/topics-controller.js')
const endpoints = require('./endpoints.json')


app.get('/api/topics', getTopics)

app.get('/api', (req, res) => {
    res.status(200).send(endpoints)
})

app.use((err, req, res, next) => {
    res.status(500).send({ msg: 'Internal server error' })
})


module.exports = app