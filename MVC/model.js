const db = require("../db/connection");
const path = require("path");
const fs = require("fs/promises");

const fetchTopics = () => {
    return db
        .query("SELECT * FROM topics;")
        .then(({ rows }) => {
            return rows;
        })
};

const fetchApi = () => {
    const filePath = path.join(__dirname, "../endpoints.json");
    return fs.readFile(filePath, "utf-8").then((data) => {
        return JSON.parse(data);
    })
};

const fetchArticleById = (articleId) => {
    return db
        .query("SELECT * FROM articles WHERE article_id = $1;", [articleId])
        .then(({ rows }) => {
            if(rows.length === 0) {
                return Promise.reject({ status: 404, msg: "Not found" })
            };
            return rows[0];
        })
};

const fetchArticles = () => {
    return db
        .query(`SELECT 
                articles.author,
                articles.title,
                articles.article_id,
                articles.topic,
                articles.created_at,
                articles.votes,
                articles.article_img_url,
                COUNT (comments.comment_id) AS comment_count
            FROM articles
            LEFT JOIN comments
            ON articles.article_id = comments.article_id
            GROUP BY articles.article_id
            ORDER BY articles.created_at DESC;`)
        .then(({ rows }) => {
            return rows;
        })
};

const checkValidArticleId = (articleId) => {
    return db
        .query("SELECT * FROM articles WHERE article_id = $1;", [articleId])
        .then(({ rows }) => {
            if (rows.length === 0) {
                return Promise.reject({ status: 404, msg: "Not found" })
            } else if (rows.length > 0) {
                return true
            }
        })
}

const fetchCommentsByArticleId = (articleId) => {
    return db
        .query(`SELECT
                comments.comment_id,
                comments.votes,
                comments.created_at,
                comments.author,
                comments.body,
                comments.article_id
            FROM comments
            WHERE comments.article_id = $1
            ORDER BY comments.created_at DESC;`, [articleId])
        .then(({ rows }) => {
            if (rows.length === 0) {
                return Promise.reject({ status: 404, msg: "Not found" })
            } else if (rows.length > 0) {
                return rows
            }
        })
};

const addCommentByArticleId = (articleId, {username, body}) => {
    const created_at = new Date()
    return db
        .query(`INSERT INTO comments
            (body, votes, author, article_id, created_at)
            VALUES
            ($1, $2, $3, $4, $5)
            RETURNING *;`, [body, 0, username, articleId, created_at])
        .then(({ rows }) => {
            return rows[0];
        })
};

const fetchPatchedArticleById = (articleId, inc_votes) => {
    return db
        .query(`UPDATE articles SET votes = votes + $1 
            WHERE article_id = $2 RETURNING *;`, [inc_votes, articleId])
        .then(({ rows }) => {
            if (rows.length === 0) {
                return Promise.reject({ status: 400, msg: "Bad request" })
            } else if (rows.length > 0) {
                return rows[0]
            }
        })
};

const checkValidCommentId = (comment_id) => {
    return db
        .query("SELECT * FROM comments WHERE comment_id = $1;", [comment_id])
        .then(({ rows }) => {
            if (rows.length === 0) {
                return Promise.reject({ status: 404, msg: "Not found" })
            } else if (rows.length > 0) {
                return true
            }
        })
}

const removeCommentsById = (comment_id) => {
    return db
        .query(`DELETE FROM comments WHERE comment_id = $1;`, [comment_id])
        .then(({ rows }) => {
            return rows
        })
        .catch( (err) => {
            return Promise.reject({ status: 404, msg: "Not found" })
        })
};


module.exports = {
    fetchTopics,
    fetchApi,
    fetchArticleById,
    fetchArticles,
    checkValidArticleId,
    fetchCommentsByArticleId,
    addCommentByArticleId,
    fetchPatchedArticleById,
    checkValidCommentId,
    removeCommentsById
}