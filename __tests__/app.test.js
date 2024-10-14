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
            expect(body).toEqual(topics)
        })
    })
    it('200 - each topic should have a slug and description key', () => {
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({body}) => {
            const allTopics = body
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