const { fetchTopics, fetchApi, fetchArticleById, fetchArticles, fetchCommentsByArticleId } = require("./model");

const getTopics = (req, res) => {
    return fetchTopics().then((topics) => {
        res.status(200).send({ topics: topics });
    })
};

const getApi = (req, res) => {
    return fetchApi().then((endpoints) => {
        res.status(200).send(endpoints)
    })
}
const getArticleById = (req, res, next) => {
    return fetchArticleById(req.params.article_id).then((article) => {
        res.status(200).send(article)
    })
    .catch((err) => {
        next(err)
    })
}

const getArticles = (req, res, next) => {
    return fetchArticles().then((articles) => {
        res.status(200).send({ articles: articles })
    })
    .catch((err) => {
        next(err)
    })
}

const getCommentsByArticleId = (req, res, next) => {
    return fetchCommentsByArticleId(req.params.article_id).then((comments) => {
        res.status(200).send({ comments: comments })
    })
    .catch((err) => {
        next(err)
    })
}

module.exports = { 
    getTopics,
    getApi,
    getArticleById,
    getArticles,
    getCommentsByArticleId
}