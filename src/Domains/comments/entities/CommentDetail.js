class DetailComment {
  constructor(payload) {
    this.verifyPayload(payload);

    const { id, username, date, content, isDelete } = payload;

    this.id = id;
    this.username = username;
    this.date = date;
    this.content = content;
    this.isDelete = isDelete;
  }

  verifyPayload({ id, username, date, content, isDelete }) {
    if (!id || !username || !date || !content || isDelete === undefined) {
      throw new Error('COMMENT_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string' ||
      typeof username !== 'string' ||
      typeof date !== 'string' ||
      typeof content !== 'string' ||
      typeof isDelete !== 'boolean'
    ) {
      throw new Error('COMMENT_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DetailComment;
