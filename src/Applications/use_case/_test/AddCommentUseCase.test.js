const { AddCommentUseCase } = require('../..');
const {
  AddedComment,
  CommentRepository,
  AddComment,
} = require('../../../Domains');

describe('AddCommentUseCase', () => {
  it('should orchestrating the add comment action correctly', async () => {
    const useCasePayload = {
      id: 'comment-123',
      content: 'Thread Comment',
    };

    const mockAddedComment = new AddedComment({
      id: useCasePayload.id,
      content: useCasePayload.content,
      owner: 'user-123',
    });

    const mockCommentRepository = new CommentRepository();

    mockCommentRepository.addComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockAddedComment));

    const addCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
    });

    const addedComment = await addCommentUseCase.execute(
      useCasePayload,
      mockAddedComment.owner,
    );

    expect(addedComment).toStrictEqual(
      new AddedComment({
        id: mockAddedComment.id,
        content: mockAddedComment.content,
        owner: mockAddedComment.owner,
      }),
    );

    expect(mockCommentRepository.addComment).toBeCalledWith(
      new AddComment({
        id: useCasePayload.id,
        content: useCasePayload.content,
        owner: mockAddedComment.owner,
      }),
    );
  });
});
