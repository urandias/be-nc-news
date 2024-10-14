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
            return rows[0];
        })
};

module.exports = {
    fetchTopics,
    fetchApi,
    fetchArticleById
}