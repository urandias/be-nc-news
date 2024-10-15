const { fetchTopics, fetchApi, fetchArticleById, fetchArticles } = require("./model");

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

const getArticles = (req, res) => {
    return fetchArticles().then((articles) => {
        res.status(200).send({ articles: articles })
    })
}

module.exports = { 
    getTopics,
    getApi,
    getArticleById,
    getArticles
}