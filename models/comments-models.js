const db = require("../db/connection");

exports.fetchCommentsByArticle = (article_id) => {
  return db
    .query(
      `
    SELECT comment_id, comments.votes, comments.created_at, comments.author, comments.body, comments.article_id
    FROM comments
    JOIN articles ON articles.article_id = comments.article_id
    WHERE comments.article_id = $1
    ORDER BY comments.created_at DESC;`,
      [article_id]
    )
    .then(({ rows }) => {
      return rows;
    });
};
