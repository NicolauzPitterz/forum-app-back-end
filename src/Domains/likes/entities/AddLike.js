class AddLike {
  constructor(payload) {
    this.verifyPayload(payload);

    const { commentId, owner } = payload;

    this.commentId = commentId;
    this.owner = owner;
  }

  verifyPayload({ commentId, owner }) {
    if (!commentId || !owner) {
      throw new Error('ADD_LIKE.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof commentId !== 'string' || typeof owner !== 'string') {
      throw new Error('ADD_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddLike;
