const AddCommentUseCase = require('../AddCommentUseCase');
const {
  AddedComment,
  CommentRepository,
  AddComment,
  ThreadRepository,
} = require('../../../Domains');

describe('AddCommentUseCase', () => {
  it('should orchestrating the add comment action correctly', async () => {
    const useCasePayload = {
      content: 'A Thread Comment',
    };

    const useCaseParam = {
      threadId: 'thread-123',
    };

    const mockAddedComment = new AddedComment({
      id: 'comment-123',
      content: useCasePayload.content,
      owner: 'user-123',
    });

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.getThreadDetailById = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.addComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockAddedComment));

    const addCommentUseCase = new AddCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    const addedComment = await addCommentUseCase.execute(
      useCaseParam,
      useCasePayload,
      'user-123',
    );

    expect(addedComment).toStrictEqual(mockAddedComment);
    expect(mockThreadRepository.getThreadDetailById).toBeCalledWith(
      useCaseParam.threadId,
    );
    expect(mockCommentRepository.addComment).toBeCalledWith(
      new AddComment({
        threadId: useCaseParam.threadId,
        content: useCasePayload.content,
        owner: 'user-123',
      }),
    );
  });
});
