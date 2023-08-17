const {db} = require("../db/connection");
const { sort } = require("../db/data/test-data/articles");

exports.fetchArticle = (articleId) => {
  return db
    .query(
      `
    SELECT articles.*, COUNT (DISTINCT comment_id)::INT AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id;`,
      [articleId]
    )
    .then(({ rows }) => {
      const article = rows[0];
      if (!article) {
        return Promise.reject({
          status: 404,
          msg: "article does not exist",
        });
      }
      return article;
    });
};

exports.fetchArticles = (topic, sort_by = `created_at`, order = 'desc') => {
  const valuesArr = []
  let queryString = `
  SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(DISTINCT comments.comment_id)::INT AS comment_count
  FROM articles
  LEFT JOIN comments
  ON comments.article_id = articles.article_id
  `
  if(topic) {
    queryString += ` WHERE articles.topic = $1 `
    valuesArr.push(topic)
  }

  if(!["author", "title", "article_id", "topic", "created_at", "votes", "article_img_url", "comment_count"].includes(sort_by)) {
    return Promise.reject({
      status: 400,
      msg: 'invalid column to sort_by'
    })
  }

  if(!["asc", "desc"].includes(order)) {
    return Promise.reject({
      status: 400,
      msg: 'invalid sort order'
    })
  }

  queryString += `GROUP BY articles.article_id ORDER BY ${sort_by} ${order};`

  return db.query(queryString, valuesArr)
  .then(({rows}) => {
    return rows
  })
}

exports.updateArticle = (article_id, votes) => {
  return db.query(`
  UPDATE articles
  SET votes = votes + $1
  WHERE article_id = $2
  RETURNING *;`, [votes, article_id])
  .then(({rows}) => {
    if(!rows.length) {
      return Promise.reject({
        status: 404,
        msg: 'article not found'
      })
    }
    return rows[0]
  })
}
