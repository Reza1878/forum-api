class AddedThreadComment {
  constructor({ content, id, owner }) {
    this._verifyPayload({ content, id, owner });

    this.content = content;
    this.id = id;
    this.owner = owner;
  }

  // eslint-disable-next-line class-methods-use-this
  _verifyPayload({ content, id, owner }) {
    if (!content || !id || !owner) {
      throw new Error('ADDED_THREAD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof content !== 'string' ||
      typeof id !== 'string' ||
      typeof owner !== 'string'
    ) {
      throw new Error('ADDED_THREAD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddedThreadComment;
