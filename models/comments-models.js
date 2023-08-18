const {db} = require("../db/connection");

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

exports.insertComment = (comment, article_id) => {
  return db.query(`
  INSERT INTO comments
    (body, author, article_id)
  VALUES 
    ($1, $2, $3)
  RETURNING *;`, [comment.body, comment.username, article_id])
  .then(({rows}) => {
    return rows[0]
  })
}

exports.removeComment = (comment_id) => {
  return db.query(
    `DELETE FROM comments
    WHERE comment_id = $1
    RETURNING *;`, [comment_id]
  ).then(({rows}) => {
    if (!rows.length){
      return Promise.reject({
        status: 404,
        msg: 'comment not found'
      })
    }
  })
}

exports.updateComment = (inc_votes, comment_id) => {
  return db.query(`
  UPDATE comments
  SET votes = votes + $1
  WHERE comment_id = $2
  RETURNING *;`, [inc_votes, comment_id])
  .then(({rows}) => {
    if(!rows.length){
      return Promise.reject({
        status: 404,
        msg: 'comment not found'
      })
    }
    return rows[0]
  })
}