class AddedThread {
  constructor(payload) {
    this._verifyPayload(payload);

    this.owner = payload.owner;
    this.id = payload.id;
    this.title = payload.title;
  }

  // eslint-disable-next-line class-methods-use-this
  _verifyPayload({ title, owner, id }) {
    if (!title || !owner || !id) {
      throw new Error('ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof title !== 'string' ||
      typeof owner !== 'string' ||
      typeof id !== 'string'
    ) {
      throw new Error('ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddedThread;
