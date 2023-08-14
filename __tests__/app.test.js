const app = require('../app')
const request = require('supertest')
const testData = require('../db/data/test-data')
const seed = require('../db/seeds/seed')
const db = require('../db/connection')
const fs = require('fs.promises')
const { values } = require('../db/data/test-data/articles')

beforeEach(() => seed(testData))
afterAll(() => db.end())

describe(('GET/api/topics'), () => {
    test('200: responds with a full list of topic objects and a status of 200', () => {
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({body}) => {
            expect(body.topics).toEqual([
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
describe("GET/api", () => {
  test('200: responds with a full list of created endpoints as a JSON object', () => {
    const expectedEndpoints = fs.readFile(`${__dirname}/../endpoints.json`, 'utf-8')
    
    const actualEndpoints = request(app)
    .get('/api')
    .expect(200)
    .then(({body}) => {
      return body
    })

    Promise.all([expectedEndpoints, actualEndpoints])
    .then((values) => {
      expect(values[0]).toEqual(values[1].endpoints)
    })
    })
    })
