const ReplyDetail = require('../ReplyDetail');

describe('a ReplyDetail entity', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      id: 'reply-123',
      username: 'nicolauzp',
      date: '2023',
    };

    expect(() => new ReplyDetail(payload)).toThrowError(
      'REPLY_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: 123,
      content: {},
      date: 2023,
      username: 'nicolauzp',
      isDelete: 'false',
    };

    expect(() => new ReplyDetail(payload)).toThrowError(
      'REPLY_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should create replyDetail object properly', () => {
    const payload = {
      id: 'reply-123',
      content: 'A Thread',
      date: '2023',
      username: 'nicolauzp',
      isDelete: false,
    };

    const { id, content, date, username, isDelete } = new ReplyDetail(payload);
    expect(id).toEqual(payload.id);
    expect(content).toEqual(payload.content);
    expect(date).toEqual(payload.date);
    expect(username).toEqual(payload.username);
    expect(isDelete).toEqual(payload.isDelete);
  });
});
