const DeleteReplyUseCase = require('../DeleteReplyUseCase');
const {
  CommentRepository,
  ThreadRepository,
  ReplyRepository,
} = require('../../../Domains');

describe('DeleteCommentUseCase', () => {
  it('should orchestrating the delete comment action correctly', async () => {
    const useCaseParam = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      replyId: 'reply-123',
      owner: 'user-123',
    };

    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockReplyRepository = new ReplyRepository();

    mockThreadRepository.getThreadDetailById = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.verifyReply = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.verifyReplyOwner = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.deleteReplyById = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    const deleteReplyUseCase = new DeleteReplyUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    await deleteReplyUseCase.execute(useCaseParam);

    expect(mockThreadRepository.getThreadDetailById).toBeCalledWith(
      useCaseParam.threadId,
    );
    expect(mockCommentRepository.verifyComment).toBeCalledWith(
      useCaseParam.threadId,
      useCaseParam.commentId,
    );
    expect(mockReplyRepository.verifyReply).toBeCalledWith(
      useCaseParam.commentId,
      useCaseParam.replyId,
    );
    expect(mockReplyRepository.verifyReplyOwner).toBeCalledWith(
      useCaseParam.replyId,
      useCaseParam.owner,
    );
    expect(mockReplyRepository.deleteReplyById).toBeCalledWith(
      useCaseParam.replyId,
    );
  });
});
