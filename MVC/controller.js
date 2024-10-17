const { fetchTopics, fetchApi, fetchArticleById, fetchArticles, checkValidArticleId, fetchCommentsByArticleId, addCommentByArticleId } = require("./model");

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
    checkValidArticleId(req.params.article_id)
    .then(() => {
        return fetchArticleById(req.params.article_id)
    })
   .then((article) => {
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
    checkValidArticleId(req.params.article_id)
    .then(() => {
        return fetchCommentsByArticleId(req.params.article_id)
    })
    .then((comments) => {
        res.status(200).send({ comments: comments })
    })
    .catch((err) => {
        next(err)
    })
}

const postCommentsByArticleId = (req, res, next) => {
  const { username, body } = req.body;
  checkValidArticleId(req.params.article_id)
    .then(() => {
      if (!username || !body) {
        return Promise.reject({ status: 422, msg: "Unprocessable entity" });
      } else {
        return addCommentByArticleId(req.params.article_id, { username, body });
      }
    })
    .then((comment) => {
      res.status(201).send({ comment: comment });
    })
    .catch((err) => {
      next(err);
    });
};


module.exports = { 
    getTopics,
    getApi,
    getArticleById,
    getArticles,
    getCommentsByArticleId,
    postCommentsByArticleId
}