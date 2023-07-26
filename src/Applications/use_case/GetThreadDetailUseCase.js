class getThreadUseCase {
  constructor({ threadRepository, commentRepository }) {
    this.threadRepository = threadRepository;
    this.commentRepository = commentRepository;
  }

  async execute(useCaseParam) {
    const { threadId } = useCaseParam;

    const threadDetail = await this.threadRepository.getThreadDetailById(
      threadId,
    );
    threadDetail.comments = await this.commentRepository.getCommentsByThreadId(
      threadId,
    );

    threadDetail.comments = this.verifyIsDeletedComments(threadDetail.comments);

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
}

module.exports = getThreadUseCase;
