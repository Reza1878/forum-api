class ThreadCommentDetail {
  constructor(payload) {
    this._verifyPayload(payload);
    this.date = payload.date;
    this.username = payload.username;
    this.id = payload.id;
    this.likeCount = payload.likeCount;
    this.content = payload.is_delete
      ? '**komentar telah dihapus**'
      : payload.content;
  }

  // eslint-disable-next-line class-methods-use-this
  _verifyPayload(payload) {
    const { date, username, id, content, likeCount } = payload;

    if (!date || !username || !id || !content) {
      throw new Error('THREAD_COMMENT_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof date !== 'string' ||
      typeof username !== 'string' ||
      typeof content !== 'string' ||
      typeof likeCount !== 'number'
    ) {
      throw new Error('THREAD_COMMENT_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = ThreadCommentDetail;
