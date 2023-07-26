const AddComment = require('../AddComment');

describe('an AddComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      owner: 'user-123',
    };

    expect(() => new AddComment(payload)).toThrowError(
      'ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      threadId: 'thread-123',
      content: {},
      owner: true,
    };

    expect(() => new AddComment(payload)).toThrowError(
      'ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should create addComment object correctly', () => {
    const payload = {
      threadId: 'thread-123',
      content: 'A Thread Comment',
      owner: 'user-123',
    };

    const { threadId, content, owner } = new AddComment(payload);

    expect(threadId).toEqual(payload.content);
    expect(content).toEqual(payload.content);
    expect(owner).toEqual(payload.owner);
  });
});
