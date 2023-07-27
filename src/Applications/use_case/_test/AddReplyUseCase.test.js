const AddReplyUseCase = require('../AddReplyUseCase');
const {
  CommentRepository,
  ThreadRepository,
  AddedReply,
  ReplyRepository,
  AddReply,
} = require('../../../Domains');

describe('AddReplyUseCase', () => {
  it('should orchestrating the add reply action correctly', async () => {
    const useCasePayload = {
      content: 'A Comment Reply',
    };

    const useCaseParam = {
      threadId: 'thread-123',
      commentId: 'comment-123',
    };

    const mockAddedReply = new AddedReply({
      id: 'reply-123',
      content: useCasePayload.content,
      owner: 'user-123',
    });

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    mockThreadRepository.getThreadDetailById = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.addReply = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockAddedReply));

    const addReplyUseCase = new AddReplyUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    const addedReply = await addReplyUseCase.execute(
      useCaseParam,
      useCasePayload,
      'user-123',
    );

    expect(addedReply).toStrictEqual(mockAddedReply);
    expect(mockThreadRepository.getThreadDetailById).toBeCalledWith(
      useCaseParam.threadId,
    );
    expect(mockCommentRepository.verifyComment).toBeCalledWith(
      useCaseParam.threadId,
      useCaseParam.commentId,
    );
    expect(mockReplyRepository.addReply).toBeCalledWith(
      new AddReply({
        commentId: useCaseParam.commentId,
        content: useCasePayload.content,
        owner: 'user-123',
      }),
    );
  });
});
