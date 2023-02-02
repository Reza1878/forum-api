class ThreadCommentLike {
  constructor(payload) {
    this._verifyPayload(payload);

    this.userId = payload.userId;
    this.threadId = payload.threadId;
    this.threadCommentId = payload.threadCommentId;
  }

  // eslint-disable-next-line class-methods-use-this
  _verifyPayload({ userId, threadId, threadCommentId }) {
    if (!userId || !threadCommentId || !threadId) {
      throw new Error('THREAD_COMMENT_LIKE.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof userId !== 'string' ||
      typeof threadCommentId !== 'string' ||
      typeof threadId !== 'string'
    ) {
      throw new Error('THREAD_COMMENT_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = ThreadCommentLike;
