const CommentReplies = {
  getCommentReplies(comments, replies) {
    return comments.map(({ id, isDelete, content, ...commentDetail }) => ({
      id,
      ...commentDetail,
      replies: replies.filter(({ commentId }) => commentId === id),
      content,
    }));
  },
};

module.exports = CommentReplies;
