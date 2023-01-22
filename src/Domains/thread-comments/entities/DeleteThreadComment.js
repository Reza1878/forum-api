class DeleteThreadComment {
  constructor(payload) {
    this._verifyPayload(payload);

    this.threadId = payload.threadId;
    this.id = payload.id;
    this.owner = payload.owner;
  }

  // eslint-disable-next-line class-methods-use-this
  _verifyPayload(payload) {
    const { threadId, id, owner } = payload;
    if (!threadId || !id || !owner) {
      throw new Error('DELETE_THREAD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }
    if (
      typeof threadId !== 'string' ||
      typeof id !== 'string' ||
      typeof owner !== 'string'
    ) {
      throw new Error('DELETE_THREAD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DeleteThreadComment;
