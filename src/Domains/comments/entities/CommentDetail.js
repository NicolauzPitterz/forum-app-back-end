class DetailComment {
  constructor(payload) {
    this.verifyPayload(payload);

    const { id, username, date, replies, content, likeCount, isDelete } =
      payload;

    this.id = id;
    this.username = username;
    this.date = date;
    this.replies = replies;
    this.content = content;
    this.likeCount = likeCount;
    this.isDelete = isDelete;
  }

  verifyPayload({ id, username, date, replies, content, likeCount, isDelete }) {
    if (
      !id ||
      !username ||
      !date ||
      !replies ||
      !content ||
      likeCount === undefined ||
      isDelete === undefined
    ) {
      throw new Error('COMMENT_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string' ||
      typeof username !== 'string' ||
      typeof date !== 'string' ||
      !Array.isArray(replies) ||
      typeof content !== 'string' ||
      typeof likeCount !== 'number' ||
      typeof isDelete !== 'boolean'
    ) {
      throw new Error('COMMENT_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DetailComment;
