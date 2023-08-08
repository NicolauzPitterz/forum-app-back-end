const {
  ThreadDetail,
  CommentDetail,
  ReplyDetail,
  FilteredComments,
  FilteredReplies,
  CommentReplies,
} = require('../../../Domains');

class getThreadUseCase {
  constructor({
    threadRepository,
    commentRepository,
    replyRepository,
    likeRepository,
  }) {
    this.threadRepository = threadRepository;
    this.commentRepository = commentRepository;
    this.replyRepository = replyRepository;
    this.likeRepository = likeRepository;
  }

  async execute(useCaseParam) {
    const { threadId } = useCaseParam;

    const thread = await this.threadRepository.getThreadDetailById(threadId);

    const comments = await this.commentRepository.getCommentsByThreadId(
      threadId,
    );
    const filteredComments = FilteredComments.verifyIsDeletedComments(
      await Promise.all(
        comments.map(
          async ({ id, ...comment }) =>
            new CommentDetail({
              id,
              ...comment,
              replies: [],
              likeCount: await this.likeRepository.getLikesByCommentId(id),
            }),
        ),
      ),
    );

    const replies = await this.replyRepository.getRepliesByThreadId(threadId);
    const filteredReplies = FilteredReplies.verifyIsDeletedReplies(
      replies.map((reply) => new ReplyDetail(reply)),
    );

    thread.comments = CommentReplies.getCommentReplies(
      filteredComments,
      filteredReplies,
    );

    return new ThreadDetail(thread);
  }
}

module.exports = getThreadUseCase;
