const db = require("../db/connection");

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

exports.fetchArticles = () => {
  return db.query(`
  SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(DISTINCT comments.comment_id)::INT AS comment_count
  FROM articles
  LEFT JOIN comments
  ON comments.article_id = articles.article_id
  GROUP BY articles.article_id
  ORDER BY articles.created_at DESC;`)
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
