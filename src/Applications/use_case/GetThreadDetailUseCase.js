class getThreadUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this.threadRepository = threadRepository;
    this.commentRepository = commentRepository;
    this.replyRepository = replyRepository;
  }

  async execute(useCaseParam) {
    const { threadId } = useCaseParam;
    const threadDetail = await this.threadRepository.getThreadDetailById(
      threadId,
    );
    threadDetail.comments = await this.commentRepository.getCommentsByThreadId(
      threadId,
    );
    const replies = await this.replyRepository.getRepliesByThreadId(threadId);
    threadDetail.comments = this.verifyIsDeletedComments(threadDetail.comments);
    threadDetail.comments = this.getCommentReplies(
      threadDetail.comments,
      replies,
    );
    return threadDetail;
  }

  verifyIsDeletedComments(comments) {
    const filteredCommentsDetail = comments.map(
      ({ isDelete, content, ...commentDetail }) => ({
        ...commentDetail,
        content: isDelete ? '**komentar telah dihapus**' : content,
      }),
    );

    return filteredCommentsDetail;
  }

  getCommentReplies(comments, replies) {
    const filteredRepliesDetail = replies.map(
      ({ isDelete, content, ...repliesDetail }) => ({
        ...repliesDetail,
        content: isDelete ? '**balasan telah dihapus**' : content,
      }),
    );

    return comments.map(({ id, isDelete, content, ...commentDetail }) => ({
      id,
      ...commentDetail,
      replies: filteredRepliesDetail.filter(
        ({ commentId }) => commentId === id,
      ),
      content,
    }));
  }
}

module.exports = getThreadUseCase;
