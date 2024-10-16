const request = require("supertest");
const app = require("../app");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const db = require("../db/connection");
const endpoints = require("../endpoints.json");
const topics = require("../db/data/test-data/topics");

beforeEach(() => seed(data));
afterAll(() => db.end());

describe("GET /api/topics", () => {
  it("200 - should respond with an array of topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual({ topics: topics });
      });
  });
  it("200 - each topic should have a slug and description key", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const allTopics = body.topics;
        expect(Array.isArray(allTopics)).toBe(true);
        if (allTopics.length === 0) {
          return Promise.reject({ status: 404, msg: "Not found" });
        } else {
          allTopics.forEach((topic) => {
            expect(topic).toHaveProperty("slug");
            expect(topic).toHaveProperty("description");
          });
        }
      });
  })
});

describe("GET /api", () => {
  it("200 - should respond with an object", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual(endpoints);
      });
  });
});

describe("GET /api/articles/:articleId", () => {
  it("200 - should respond with an object containing the correct article", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual({
          article_id: expect.any(Number),
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
        });
      });
  });
  it("400 - responds with an error msg for an invalid article_id type", () => {
    return request(app)
      .get("/api/articles/not-a-number")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("Invalid data type");
      });
  });
  it("404 - responds with an error msg for an article_id that does not exist", () => {
    return request(app)
      .get("/api/articles/9999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual("Not found");
      });
  });
});

describe("GET /api/articles", () => {
  it("200 - should respond with an object with a key of articles containing an array of articles", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.articles)).toBe(true);
      });
  });
  it("200 - should respond with an array of articles with the correct keys", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        if (articles.length === 0) {
          return Promise.reject({ status: 404, msg: "Not found" });
        } else {
          articles.forEach((article) => {
            expect(article).toEqual({
              article_id: expect.any(Number),
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
              comment_count: expect.any(String),
            });
          });
        }
      });
  });
});

describe('GET /api/articles/:article_id/comments', () => {
    it('200 - should respond with an array of comments with the correct keys', () => {
        return request(app)
            .get('/api/articles/1/comments')
            .expect(200)
            .then(({ body }) => {
                expect(Array.isArray(body.comments)).toBe(true)
                expect(body.comments[0]).toHaveProperty('comment_id')
                expect(body.comments[0]).toHaveProperty('votes')
                expect(body.comments[0]).toHaveProperty('created_at')
                expect(body.comments[0]).toHaveProperty('author')
                expect(body.comments[0]).toHaveProperty('body')
                expect(body.comments[0]).toHaveProperty('article_id')

            })
    })
    it("400 - responds with an error msg for an invalid article_id type", () => {
      return request(app)
        .get("/api/articles/not-a-number/comments")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toEqual("Invalid data type");
        });
    });
    it("404 - responds with an error msg for an article_id that does not exist", () => {
      return request(app)
        .get("/api/articles/9999/comments")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toEqual("Not found");
        });
    });
})