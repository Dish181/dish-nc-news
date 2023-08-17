const app = require("../app");
const request = require("supertest");
const testData = require("../db/data/test-data");
const seed = require("../db/seeds/seed");
const {db} = require("../db/connection");
const endpointsJson = require("../endpoints.json");
const { string } = require("pg-format");

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
    const param = 1
    let comment_count = 0
    testData.commentData.forEach(comment => {
      if(comment.article_id === param){
        comment_count++
      }
    })
    return request(app)
    .get(`/api/articles/${param}`)
    .expect(200)
    .then(({body}) => {
      expect(body).toHaveProperty('article', {
        article_id: param,
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: "2020-07-09T20:11:00.000Z",
        votes: 100,
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        comment_count: comment_count
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
      expect(body).toHaveProperty('msg', 'article does not exist')
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
  test('200: TOPIC QUERY: the endpoint can accept a topic query, which returns only articles with the specified topic value.', () => {
    const topicQuery = 'mitch'
    const filteredArticles = testData.articleData.filter(article => {
      return article.topic === topicQuery
    })
    return request(app)
    .get(`/api/articles?topic=${topicQuery}`)
    .expect(200)
    .then(({body}) => {
      expect(body.articles.length).toBe(filteredArticles.length)
      body.articles.forEach(article => {
        expect(article.topic).toBe(topicQuery)
      })
    })
  })
  test('200: TOPIC QUERY: when given a topic that does not match any articles, returns an empty array', () => {
    const topicQuery = 'egg'
    return request(app)
    .get(`/api/articles?topic=${topicQuery}`)
    .expect(200)
    .then(({body}) => {
      expect(body.articles).toEqual([])
      })
  })
  test('200: SORT_BY QUERY: the endpoint can accept a sort_by query, which can be used to sort the results by any given valid column name, if no given order query, the direction is desc by default', () => {
    return request(app)
    .get(`/api/articles?sort_by=author`)
    .expect(200)
    .then(({body}) => {
      expect(body.articles).toBeSortedBy("author", {descending: true})
    })
  })
  test('400: SORT_BY QUERY: when given an invalid column name to sort by, return a bad request error', () => {
    return request(app)
    .get(`/api/articles?sort_by=helmet`)
    .expect(400)
    .then(({body}) => {
      expect(body).toHaveProperty('msg', 'invalid column to sort_by')
    })
  })
  test('200: ORDER QUERY: the endpoint can be given an order query which specifies the direction in which to sort the returned articles', () => {
    return request(app)
    .get(`/api/articles?order=asc`)
    .expect(200)
    .then(({body}) => {
      expect(body.articles).toBeSortedBy("created_at", {coerce: true})
    })
  })
  test('400: ORDER QUERY: when given an invalid order direction to sort in, return a bad request error', () => {
    return request(app)
    .get(`/api/articles?order=up`)
    .expect(400)
    .then(({body}) => {
      expect(body).toHaveProperty('msg', 'invalid sort order')
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
        expect(comment).toHaveProperty('article_id', 9)
      })
    })
  })
  test('200: responds with an empty array when passed an article_id which exists, but has no associated comments', () => {
    return request(app)
    .get('/api/articles/11/comments')
    .expect(200)
    .then(({body}) => {
      expect(body).toHaveProperty('comments', [])
    })
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

describe('POST/api/articles/:article_id/comments', () => {
  test('201: Returns the posted comment object', () => {
  const newComment = {username: 'butter_bridge', body: 'pretty reductive, honestly'}
  return request(app)
  .post('/api/articles/11/comments')
  .send(newComment)
  .expect(201)
  .then(({body}) => {
    expect(Object.keys(body.postedComment).length).toBe(6)
    expect(body.postedComment).toHaveProperty('author', 'butter_bridge')
    expect(body.postedComment).toHaveProperty('article_id', 11)
    expect(body.postedComment).toHaveProperty('body', 'pretty reductive, honestly')
    expect(body.postedComment).toHaveProperty('comment_id', expect.any(Number))
    expect(body.postedComment).toHaveProperty('created_at', expect.any(String))
    expect(body.postedComment).toHaveProperty('votes', 0)
  })
  })
  test('201: returns success when given a bloated object, but which contains all required fields', () => {
    const newComment = {username: 'butter_bridge', body: 'pretty reductive, honestly', hat: 'fancy', age: '12'}
  return request(app)
  .post('/api/articles/11/comments')
  .send(newComment)
  .expect(201)
  .then(({body}) => {
    expect(Object.keys(body.postedComment).length).toBe(6)
    expect(body.postedComment).toHaveProperty('author', 'butter_bridge')
    expect(body.postedComment).toHaveProperty('article_id', 11)
    expect(body.postedComment).toHaveProperty('body', 'pretty reductive, honestly')
    expect(body.postedComment).toHaveProperty('comment_id', expect.any(Number))
    expect(body.postedComment).toHaveProperty('created_at', expect.any(String))
    expect(body.postedComment).toHaveProperty('votes', 0)
  })
  })
  test(`400: responds with a bad request error when given a non-number article_id param`, () => {
    const newComment = {username: 'butter_bridge', body: 'pretty bad request, honestly'}
    return request(app)
    .post('/api/articles/banana/comments')
    .send(newComment)
    .expect(400)
    .then(({body}) => {
      expect(body).toHaveProperty('msg', 'bad request')
    })
  })
  test(`404: responds with a bad request error when given a valid article_id format, that doesn't exist`, () => {
    const newComment = {username: 'butter_bridge', body: 'Where am I, honestly?'}
    return request(app)
    .post('/api/articles/900/comments')
    .send(newComment)
    .expect(404)
    .then(({body}) => {
      expect(body).toHaveProperty('msg', 'not found')
    })
  })
  test(`404: responds with a not found error when given a user_name which doesn't exist in the authors table`, () => {
    const newComment = {username: 'dish', body: 'A mystery man'}
    return request(app)
    .post('/api/articles/11/comments')
    .send(newComment)
    .expect(404)
    .then(({body}) => {
      expect(body).toHaveProperty('msg', 'not found')
    })
  })
  test(`400: responds with a bad request error when the required fields are missing`, () => {
    const badComment = {hat: 'very nice', age: '12', networth: '99999999'}
    return request(app)
    .post('/api/articles/11/comments')
    .send(badComment)
    .expect(400)
    .then(({body}) => {
      expect(body).toHaveProperty('msg', 'bad request')
    })
  })
  test(`400: responds with a bad request error when given a malformed request body`, () => {
    const awfulComment = ['bad bad bad']
    return request(app)
    .post('/api/articles/11/comments')
    .send(awfulComment)
    .expect(400)
    .then(({body}) => {
      expect(body).toHaveProperty('msg', 'bad request')
    })
  })
})

describe('PATCH/api/articles/:article_id', () => {
  test('200: responds with the updated article when given a valid param and body', () => {
    const articleVotes = { inc_votes: -10 }
    return request(app)
    .patch('/api/articles/1')
    .send(articleVotes)
    .expect(200)
    .then(({body}) => {
      expect(body.updatedArticle).toEqual({
        article_id: 1,
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: "2020-07-09T20:11:00.000Z",
        votes: 90,
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      })
    })
  })
  test('200: responds with the updated article when given a bloated object which contains inc_votes, along with additional properties. The additional properties should be ignored and the votes property should be updated correctly', () => {
    const articleVotes = { hair: 'blonde', inc_votes: 800, abc: 'def', body: 'trying to change the body when I shouldnt be able to hahaha' }
    return request(app)
    .patch('/api/articles/1')
    .send(articleVotes)
    .expect(200)
    .then(({body}) => {
      expect(body.updatedArticle).toEqual({
        article_id: 1,
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: "2020-07-09T20:11:00.000Z",
        votes: 900,
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      })
    })
  })
  test('400: responds with a bad request error when given a non-number for the inc_votes value in the request body', () => {
    const articleVotes = { inc_votes: "abc" }
    return request(app)
    .patch('/api/articles/1')
    .send(articleVotes)
    .expect(400)
    .then(({body}) => {
      expect(body).toHaveProperty('msg', 'bad request')
    })
  })
  test('400: responds with a bad request error when given a decimal number in the request body', () => {
    const articleVotes = { inc_votes: 1.5436 }
    return request(app)
    .patch('/api/articles/1')
    .send(articleVotes)
    .expect(400)
    .then(({body}) => {
      expect(body).toHaveProperty('msg', 'bad request')
    })
  })
  test('400: responds with a bad request error when given an non-number as the article_id', () => {
    const articleVotes = { inc_votes: 10 }
    return request(app)
    .patch('/api/articles/abc')
    .send(articleVotes)
    .expect(400)
    .then(({body}) => {
      expect(body).toHaveProperty('msg', 'bad request')
    })
  })
  test('400: responds with a bad request error when not given an inc_votes property in the request body', () => {
    const articleVotes = { hair: 'blonde' }
    return request(app)
    .patch('/api/articles/1')
    .send(articleVotes)
    .expect(400)
    .then(({body}) => {
      expect(body).toHaveProperty('msg', 'bad request')
    })
  })
  test('404: responds with a not found error when given a valid format article_id which does not exist', () => {
    const articleVotes = { inc_votes: "10" }
    return request(app)
    .patch('/api/articles/900')
    .send(articleVotes)
    .expect(404)
    .then(({body}) => {
      expect(body).toHaveProperty('msg', 'article not found')
    })
  })
})

describe('DELETE/api/comments/:comment_id', () => {
  test('204: comment is successfully deleted and no content is returned', () => {
    return request(app)
    .delete('/api/comments/3')
    .expect(204)
    .then(({body}) => {
      expect(body).toEqual({})
    })
  })
  test('400: returns bad request error when passed a comment_id in incorrect format (non-number)', () => {
    return request(app)
    .delete('/api/comments/abc')
    .expect(400)
    .then(({body}) => {
      expect(body).toHaveProperty('msg', 'bad request')
    })
  })
  test('404: returns a not found error when passed a comment_id which does not exist in the comments table', () => {
    return request(app)
    .delete('/api/comments/900')
    .expect(404)
    .then(({body}) => {
      expect(body).toHaveProperty('msg', 'comment not found')
    })
  })
})

describe('GET/api/users', () => {
  test('200: responds with a full list of user objects', () => {
    return request(app)
    .get('/api/users')
    .expect(200)
    .then(({body}) => {
      expect(body.users.length).toBe(testData.userData.length)
      body.users.forEach(user => {
        expect(user).toHaveProperty('username', expect.any(String))
        expect(user).toHaveProperty('name', expect.any(String))
        expect(user).toHaveProperty('avatar_url', expect.any(String))
      })
    })
  })
})

describe('GET/api/users/:username', () => {
  test('200: responds with a single user object which corresponds to the given username', () => {
    return request(app)
    .get('/api/users/butter_bridge')
    .expect(200)
    .then(({body}) => {
      expect(body.user).toHaveProperty('name', expect.any(String))
      expect(body.user).toHaveProperty('username', 'butter_bridge')
      expect(body.user).toHaveProperty('avatar_url', expect.any(String))
    })
  })
  test('404: responds with a not found error when given a username which doesnt exist', () => {
    return request(app)
    .get('/api/users/dish181')
    .expect(404)
    .then(({body}) => {
      expect(body).toHaveProperty('msg', 'user not found')
    })
  })
})