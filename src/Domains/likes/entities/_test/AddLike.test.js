const AddLike = require('../AddLike');

describe('an AddLike entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      commentId: 'comment-123',
    };

    expect(() => new AddLike(payload)).toThrowError(
      'ADD_LIKE.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      commentId: 'comment-123',
      owner: true,
    };

    expect(() => new AddLike(payload)).toThrowError(
      'ADD_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should create addLike object correctly', () => {
    const payload = {
      commentId: 'comment-123',
      owner: 'user-123',
    };

    const { commentId, owner } = new AddLike(payload);

    expect(commentId).toEqual(payload.commentId);
    expect(owner).toEqual(payload.owner);
  });
});
