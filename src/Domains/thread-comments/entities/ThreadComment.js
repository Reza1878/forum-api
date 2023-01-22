class ThreadComment {
  constructor({ content, threadId, owner }) {
    this._verifyPayload({ content, threadId, owner });

    this.content = content;
    this.threadId = threadId;
    this.owner = owner;
  }

  // eslint-disable-next-line class-methods-use-this
  _verifyPayload({ content, threadId, owner }) {
    if (!content || !threadId || !owner) {
      throw new Error('THREAD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof content !== 'string' ||
      typeof threadId !== 'string' ||
      typeof owner !== 'string'
    ) {
      throw new Error('THREAD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = ThreadComment;
