const CommentDetail = require('../CommentDetail');

describe('a CommentDetail entity', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      id: 'comment-123',
      username: 'nicolauzp',
      date: '2023',
    };

    expect(() => new CommentDetail(payload)).toThrowError(
      'COMMENT_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: 123,
      username: 'nicolauzp',
      date: 2023,
      content: {},
      isDelete: 'false',
    };

    expect(() => new CommentDetail(payload)).toThrowError(
      'COMMENT_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should create CommentDetail entities properly', () => {
    const payload = {
      id: 'comment-123',
      username: 'nicolauzp',
      date: '2023',
      content: 'A Thread',
      isDelete: false,
    };

    const { id, username, date, content, isDelete } = new CommentDetail(
      payload,
    );
    expect(id).toEqual(payload.id);
    expect(username).toEqual(payload.username);
    expect(date).toEqual(payload.date);
    expect(content).toEqual(payload.content);
    expect(isDelete).toEqual(payload.isDelete);
  });
});
