const app = require("../app");
const request = require("supertest");
const testData = require("../db/data/test-data");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");
const endpointsJson = require("../endpoints.json");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("GET/api/topics", () => {
  test("200: responds with a full list of topic objects and a status of 200", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(body.topics).toEqual([
          {
            description: "The man, the Mitch, the legend",
            slug: "mitch",
          },
          {
            description: "Not dogs",
            slug: "cats",
          },
          {
            description: "what books are made of",
            slug: "paper",
          },
        ]);
      });
  });
});
describe("GET/api", () => {
  test("200: responds with a full list of created endpoints as a JSON object", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(JSON.parse(body.endpoints)).toEqual(endpointsJson)  
      });
  });
});


describe('GET/api/articles/:article_id', () => {
  test('200: 200 status code is returned with the correct article object for the passed id', () => {
    return request(app)
    .get('/api/articles/1')
    .expect(200)
    .then(({body}) => {
      expect(body).toHaveProperty('article', {
        article_id: 1,
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: "2020-07-09T20:11:00.000Z",
        votes: 100,
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      })
    })
  })
  test('400: 400 status code and error message returned when a non-number is passed as an article_id', () => {
    return request(app)
    .get('/api/articles/one')
    .expect(400)
    .then(({body}) => {
      expect(body).toHaveProperty('msg', 'bad request')
    })
  })
  test('404: 404 status code and error message returned when no article is found for the given, valid numeric article id input', () => {
    return request(app)
    .get('/api/articles/90')
    .expect(404)
    .then(({body}) => {
      expect(body).toHaveProperty('msg', 'no article found with the given id')
    })
  })
})

describe('GET/api/articles', () => {
  test('200: 200 status code and an array of articles objects returned sorted in descending date order by default', () => {
    return request(app)
    .get('/api/articles')
    .expect(200)
    .then(({body}) => {
      expect(body.articles.length).toBe(13)
      expect(body.articles).toBeSortedBy('created_at', {
        descending: true
      })
      body.articles.forEach(article => {
        expect(article).toHaveProperty('author', expect.any(String))
        expect(article).toHaveProperty('title', expect.any(String))
        expect(article).toHaveProperty('article_id', expect.any(Number))
        expect(article).toHaveProperty('topic', expect.any(String))
        expect(article).toHaveProperty('created_at', expect.any(String))
        expect(article).toHaveProperty('votes', expect.any(Number))
        expect(article).toHaveProperty('article_img_url', expect.any(String))
        expect(article).toHaveProperty('comment_count', expect.any(Number))
      }) 
    })
  })
})

// describe('POST/api/articles/:article_id/comments', () => {
//   test('201: Returns the posted comment object', () => {
//   const newComment = {username: 'dish', body: 'pretty reductive, honestly'}
//   return request(app)
//   .post('/api/articles/11/comments')
//   .send(newComment)
//   .expect(201)
//   .then(({rows}) => {
//     expect(rows.postedComment).toEqual(newComment)
//   })
//   })
// })