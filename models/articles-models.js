const db = require("../db/connection");

exports.fetchArticle = (articleId) => {
  return db
    .query(
      `
    SELECT *
    FROM articles
    WHERE article_id = $1;`,
      [articleId]
    )
    .then(({ rows }) => {
      const article = rows[0];
      if (!article) {
        return Promise.reject({
          status: 404,
          msg: "no article found with the given id",
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
