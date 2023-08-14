const app = require('../app')
const request = require('supertest')
const testData = require('../db/data/test-data')
const seed = require('../db/seeds/seed')
const db = require('../db/connection')

beforeEach(() => seed(testData))
afterAll(() => db.end())

describe(('GET/api/topics'), () => {
    test('200: responds with a full list of topic objects and a status of 200', () => {
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({body}) => {
            expect(body).toEqual([
                {
                  description: 'The man, the Mitch, the legend',
                  slug: 'mitch'
                },
                {
                  description: 'Not dogs',
                  slug: 'cats'
                },
                {
                  description: 'what books are made of',
                  slug: 'paper'
                }
              ])
        })
    })
})