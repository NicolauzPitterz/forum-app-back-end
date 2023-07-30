const {
  ThreadDetail,
  CommentDetail,
  ReplyDetail,
} = require('../../../Domains');

class getThreadUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this.threadRepository = threadRepository;
    this.commentRepository = commentRepository;
    this.replyRepository = replyRepository;
  }

  async execute(useCaseParam) {
    const { threadId } = useCaseParam;
    const thread = await this.threadRepository.getThreadDetailById(threadId);
    const comments = await this.commentRepository.getCommentsByThreadId(
      threadId,
    );
    const filteredComments = this.verifyIsDeletedComments(
      comments.map(
        ({ ...comment }) => new CommentDetail({ ...comment, replies: [] }),
      ),
    );
    const replies = await this.replyRepository.getRepliesByThreadId(threadId);
    const filteredReplies = this.verifyIsDeletedReplies(
      replies.map((reply) => new ReplyDetail(reply)),
    );

    thread.comments = this.getCommentReplies(filteredComments, filteredReplies);

    return new ThreadDetail(thread);
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

  verifyIsDeletedReplies(replies) {
    const filteredRepliesDetail = replies.map(
      ({ isDelete, content, ...repliesDetail }) => ({
        ...repliesDetail,
        content: isDelete ? '**balasan telah dihapus**' : content,
      }),
    );

    return filteredRepliesDetail;
  }

  getCommentReplies(comments, replies) {
    return comments.map(({ id, isDelete, content, ...commentDetail }) => ({
      id,
      ...commentDetail,
      replies: replies.filter(({ commentId }) => commentId === id),
      content,
    }));
  }
}

module.exports = getThreadUseCase;
