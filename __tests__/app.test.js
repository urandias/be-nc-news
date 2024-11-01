const request = require("supertest");
const app = require("../app");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const db = require("../db/connection");
const endpoints = require("../endpoints.json");
const topics = require("../db/data/test-data/topics");
require('jest-sorted')

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
  });
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
        expect(body.msg).toBe("Invalid data type");
      });
  });
  it("404 - responds with an error msg for an article_id that does not exist", () => {
    return request(app)
      .get("/api/articles/9999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
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

describe("GET /api/articles/:article_id/comments", () => {
  it("should return a status code of 200 and an ordered array of comments", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toBeSortedBy("created_at", { descending: true, coerce: true });
        comments.forEach((comment) => {
          expect(comment.article_id).toBe(1);
          expect(comment).toEqual({
            comment_id: expect.any(Number),
            body: expect.any(String),
            article_id: expect.any(Number),
            author: expect.any(String),
            votes: expect.any(Number),
            created_at: expect.any(String),
          });
        });
      });
  });
  it("200 - should respond with an array of comments with the correct keys", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.comments)).toBe(true);
        const comments = body.comments;
        comments.forEach((comment) => {
          expect(comment).toHaveProperty("comment_id");
          expect(comment).toHaveProperty("votes");
          expect(comment).toHaveProperty("created_at");
          expect(comment).toHaveProperty("author");
          expect(comment).toHaveProperty("body");
          expect(comment).toHaveProperty("article_id");
        });
      });
  });
  it("200 - responds with empty array when article exists but has no comments", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        if (body.comments.length === 0) {
          expect(body.comments).toEqual([]);
          expect(body.comments.length).toEqual(0);
        }
      });
  });
  it("400 - responds with an error msg for an invalid article_id type", () => {
    return request(app)
      .get("/api/articles/not-a-number/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid data type");
      });
  });
  it("404 - responds with an error msg for an article_id that does not exist", () => {
    return request(app)
      .get("/api/articles/9999/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  it("201 - should respond with an object containing the new comment", () => {
    const newComment = {
      username: "butter_bridge",
      body: "I am a comment",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        const { comment } = body;
        expect(comment.body).toBe("I am a comment");
        expect(comment.author).toBe("butter_bridge");
        expect(comment).toHaveProperty("comment_id");
        expect(comment).toHaveProperty("votes");
        expect(comment).toHaveProperty("created_at");
        expect(comment).toHaveProperty("article_id");
      });
  });
  it("400 - responds with an error msg for an invalid article_id type", () => {
    const newComment = {
      username: "butter_bridge",
      body: "I am a comment",
    };
    return request(app)
      .post("/api/articles/not-a-number/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid data type");
      });
  });
  it("404 - responds with an error msg for an article_id that does not exist", () => {
    const newComment = {
      username: "butter_bridge",
      body: "I am a comment",
    };
    return request(app)
      .post("/api/articles/9999/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
  it('422 - responds with an error msg for an invalid comment body', () => {
    const newComment = {
      username: "butter_bridge",
      body: "",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(422)
      .then(({ body }) => {
        expect(body.msg).toBe("Unprocessable entity");
      });
  })
});

describe('PATCH /api/articles/:article_id', () => {
  it('200 - responds with an object containing the updated article, with an increase in votes', () => {
    const newArticle = {
      inc_votes: 10
    }
    return request(app)
      .patch('/api/articles/1')
      .send(newArticle)
      .expect(200)
      .then(({ body }) => {
        const { article } = body
        expect(article.votes).toBe(110)
      })
  })
  it('200 - responds with an object containing the updated article, with a decrease in votes', () => {
    const newArticle = {
      inc_votes: -90
    }
    return request(app)
      .patch('/api/articles/1')
      .send(newArticle)
      .expect(200)
      .then(({ body }) => {
        const { article } = body
        expect(article.votes).toBe(10)
      })
  })
  it('400 - responds with an error msg for an invalid article_id type', () => {
    const newArticle = {
      inc_votes: 10
    }
    return request(app)
      .patch('/api/articles/not-a-number')
      .send(newArticle)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Invalid data type')
      })
  })
  it('404 - responds with an error msg for an article_id that does not exist', () => {
    const newArticle = {
      inc_votes: 10
    }
    return request(app)
    .patch('/api/articles/9999')
    .send(newArticle)
    .expect(404)
    .then(({ body }) => {
      expect(body.msg).toBe('Not found')
    })
  })
})

describe('DELETE /api/comments/:comment_id', () => {
  it('204 - responds with no content when comment is deleted successfully', () => {
    return request(app)
    .delete('/api/comments/1')
    .expect(204)
    .then(({ body }) => {
      expect(body).toEqual({})
    })
  })
  it('404 - responds with an error msg for an comment_id that does not exist', () => {
    return request(app)
    .delete('/api/comments/9999')
    .expect(404)
    .then(({ body }) => {
      expect(body.msg).toBe('Not found')
    })
  })
  it('400 - responds with an error msg for an invalid comment_id type', () => {
    return request(app)
    .delete('/api/comments/not-a-number')
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe('Invalid data type')
    })
  })
})

describe("GET /api/users", () => {
  it("200 - responds with an array of users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const users = body.users;
        expect(Array.isArray(body.users)).toBe(true);
        users.forEach((user) => {
          expect(user).toEqual({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
});

// describe("GET /api/articles (sorting queries)", () => {
//   describe("sort_by query parameter", () => {
//     it("200 - defaults to sort by created_at in descending order when no queries provided", () => {
//       return request(app)
//         .get("/api/articles")
//         .expect(200)
//         .then(({ body }) => {
//           expect(body.articles).toBeSortedBy("created_at", { descending: true });
//         });
//     });
    
//     it("200 - sorts by author when specified", () => {
//       return request(app)
//         .get("/api/articles?sort_by=author")
//         .expect(200)
//         .then(({ body }) => {
//           expect(body.articles).toBeSortedBy("author", { descending: true });
//         });
//     });

//     it("200 - sorts by title when specified", () => {
//       return request(app)
//         .get("/api/articles?sort_by=title")
//         .expect(200)
//         .then(({ body }) => {
//           expect(body.articles).toBeSortedBy("title", { descending: true });
//         });
//     });

//     it("200 - sorts by article_id when specified", () => {
//       return request(app)
//         .get("/api/articles?sort_by=article_id")
//         .expect(200)
//         .then(({ body }) => {
//           expect(body.articles).toBeSortedBy("article_id", { descending: true });
//         });
//     });

//     it("200 - sorts by votes when specified", () => {
//       return request(app)
//         .get("/api/articles?sort_by=votes")
//         .expect(200)
//         .then(({ body }) => {
//           expect(body.articles).toBeSortedBy("votes", { descending: true });
//         });
//     });

//     it("200 - sorts by comment_count when specified", () => {
//       return request(app)
//         .get("/api/articles?sort_by=comment_count")
//         .expect(200)
//         .then(({ body }) => {
//           expect(body.articles).toBeSortedBy("comment_count", { descending: true });
//         });
//     });

//     it("400 - responds with error when sort_by column doesn't exist", () => {
//       return request(app)
//         .get("/api/articles?sort_by=not_a_column")
//         .expect(400)
//         .then(({ body }) => {
//           expect(body.msg).toBe("Invalid sort query");
//         });
//     });
//   });
// })

//   describe("order query parameter", () => {
//     it("200 - accepts ascending order", () => {
//       return request(app)
//         .get("/api/articles?order=asc")
//         .expect(200)
//         .then(({ body }) => {
//           expect(body.articles).toBeSortedBy("created_at");
//         });
//     });

//     it("200 - accepts descending order", () => {
//       return request(app)
//         .get("/api/articles?order=desc")
//         .expect(200)
//         .then(({ body }) => {
//           expect(body.articles).toBeSortedBy("created_at", { descending: true });
//         });
//     });

//     it("200 - works with both sort_by and order queries together", () => {
//       return request(app)
//         .get("/api/articles?sort_by=title&order=asc")
//         .expect(200)
//         .then(({ body }) => {
//           expect(body.articles).toBeSortedBy("title");
//         });
//     });

//     it("400 - responds with error for invalid order value", () => {
//       return request(app)
//         .get("/api/articles?order=invalid_order")
//         .expect(400)
//         .then(({ body }) => {
//           expect(body.msg).toBe("Invalid order query");
//         });
//     });
//   });
