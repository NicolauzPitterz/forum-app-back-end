const LikeCommentUseCase = require('../LikeCommentUseCase');
const {
  CommentRepository,
  LikeRepository,
  ThreadRepository,
  AddLike,
} = require('../../../../Domains');

describe('LikeCommentUseCase', () => {
  it('should orchestrating the like comment action correctly if the comment has not been liked', async () => {
    const useCaseParam = {
      threadId: 'thread-123',
      commentId: 'comment-123',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockLikeRepository = new LikeRepository();

    mockThreadRepository.checkAvailabilityThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockLikeRepository.verifyLike = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockLikeRepository.addLike = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    const likeCommentUseCase = new LikeCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
    });

    await likeCommentUseCase.execute(useCaseParam, 'user-123');

    expect(mockThreadRepository.checkAvailabilityThread).toBeCalledWith(
      useCaseParam.threadId,
    );
    expect(mockCommentRepository.verifyComment).toBeCalledWith(
      useCaseParam.threadId,
      useCaseParam.commentId,
    );
    expect(mockLikeRepository.verifyLike).toBeCalledWith(
      useCaseParam.commentId,
      'user-123',
    );
    expect(mockLikeRepository.addLike).toBeCalledWith(
      new AddLike({
        commentId: useCaseParam.commentId,
        owner: 'user-123',
      }),
    );
  });

  it('should orchestrating the like comment action correctly if the comment has been liked', async () => {
    const useCaseParam = {
      threadId: 'thread-123',
      commentId: 'comment-123',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockLikeRepository = new LikeRepository();

    mockThreadRepository.checkAvailabilityThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockLikeRepository.verifyLike = jest
      .fn()
      .mockImplementation(() => Promise.resolve({ id: 'like-123' }));
    mockLikeRepository.deleteLikeById = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    const likeCommentUseCase = new LikeCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
    });

    await likeCommentUseCase.execute(useCaseParam, 'user-123');

    expect(mockThreadRepository.checkAvailabilityThread).toBeCalledWith(
      useCaseParam.threadId,
    );
    expect(mockCommentRepository.verifyComment).toBeCalledWith(
      useCaseParam.threadId,
      useCaseParam.commentId,
    );
    expect(mockLikeRepository.verifyLike).toBeCalledWith(
      useCaseParam.commentId,
      'user-123',
    );
    expect(mockLikeRepository.deleteLikeById).toBeCalledWith('like-123');
  });
});
