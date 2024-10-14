const request = require("supertest");
const app = require("../app")
const seed = require("../db/seeds/seed")
const data = require('../db/data/test-data')
const db = require('../db/connection')
const endpoints = require('../endpoints.json')
const topics = require('../db/data/test-data/topics')

beforeEach(() => seed(data))
afterAll(() => db.end())

describe('GET /api/topics', () => {
    it('200 - should respond with an array of topics', () => {
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({body}) => {
            expect(body).toEqual({ topics: topics })
        })
    })
    it('200 - each topic should have a slug and description key', () => {
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({body}) => {
            const allTopics = body.topics
            allTopics.forEach((topic) => {
                expect(topic).toHaveProperty('slug')
                expect(topic).toHaveProperty('description')
            })
        })
    })
})

describe('GET /api', () => {
    it('200 - should respond with an object', () => {
        return request(app)
        .get('/api')
        .expect(200)
        .then(({body}) => {
            expect(body).toEqual(endpoints)
        })
    })
})

describe.only('GET /api/articles/:articleId', () => {
    it('200 - should respond with an object containing the correct article', () => {
        return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then(({body}) => {
            expect(body).toEqual({
                article_id: 1,
                title: 'Living in the shadow of a great man',
                topic: 'mitch',
                author: 'butter_bridge',
                body: 'I find this existence challenging',
                created_at: '2020-07-09T20:11:00.000Z',
                votes: 100,
                article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
              })
            expect(body).toEqual({
                article_id: expect.any(Number),
                title: expect.any(String),
                topic: expect.any(String),
                author: expect.any(String),
                body: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                article_img_url: expect.any(String)
            })
        })
    })
    it('400 - responds with an error msg for an invalid article_id type', () => {
        return request(app)
        .get('/api/articles/not-a-number')
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toEqual('Invalid data type')
        })
    })
})