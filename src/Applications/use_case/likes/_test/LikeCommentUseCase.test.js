const LikeCommentUseCase = require('../LikeCommentUseCase');
const { CommentRepository, LikeRepository } = require('../../../../Domains');

describe('LikeCommentUseCase', () => {
  it('should orchestrating the like comment action correctly', async () => {
    const useCaseParam = {
      threadId: 'thread-123',
      commentId: 'comment-123',
    };

    const mockCommentRepository = new CommentRepository();
    const mockLikeRepository = new LikeRepository();

    mockCommentRepository.verifyComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockLikeRepository.verifyLike = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockLikeRepository.addLike = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    const addReplyUseCase = new LikeCommentUseCase({
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
    });

    await addReplyUseCase.execute(useCaseParam, 'user-123');

    expect(mockCommentRepository.verifyComment).toBeCalledWith(
      useCaseParam.threadId,
      useCaseParam.commentId,
    );
    expect(mockLikeRepository.verifyLike).toBeCalledWith(
      useCaseParam.commentId,
      'user-123',
    );
    expect(mockLikeRepository.addLike).toBeCalledWith(
      useCaseParam.commentId,
      'user-123',
    );
  });
});
