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

describe('GET/api/articles/:article_id/comments', () => {
  test('200: responds with an array of comment objects relating to the given article_id sorted from newest to oldest', () => {
    return request(app)
    .get('/api/articles/9/comments')
    .expect(200)
    .then(({body}) => {
      expect(body.comments.length).toBe(2)
      expect(body.comments).toBeSortedBy('created_at', {descending: true})
      body.comments.forEach(comment => {
        expect(comment).toHaveProperty('comment_id', expect.any(Number))
        expect(comment).toHaveProperty('votes', expect.any(Number))
        expect(comment).toHaveProperty('created_at', expect.any(String))
        expect(comment).toHaveProperty('author', expect.any(String))
        expect(comment).toHaveProperty('body', expect.any(String))
        expect(comment).toHaveProperty('article_id', expect.any(Number))
      })
    })
  })
  test('200: responds with an empty array when passed an article_id which exists, but has no associated comments', () => {
    return request(app)
    .get('/api/articles/')
  })
  test('400: responds with a bad request error when given a non-number article_id param', () => {
    return request(app)
    .get('/api/articles/verygood/comments')
    .expect(400)
    .then(({body}) => {
      expect(body).toHaveProperty('msg', 'bad request')
    })
  })
  test('404: responds with a not found message when no articles exist for the given id', () => {
    return request(app)
    .get('/api/articles/999/comments')
    .expect(404)
    .then(({body}) => {
      expect(body).toHaveProperty('msg', 'article does not exist')
    })
  })
}
)