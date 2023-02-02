const ThreadCommentLike = require('../ThreadCommentLike');

describe('ThreadCommentLike entities', () => {
  it('should throw error when not contain needed property', () => {
    expect(() => new ThreadCommentLike({})).toThrowError(
      'THREAD_COMMENT_LIKE.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });
  it('should throw error when not meet data type specification', () => {
    const payload = {
      userId: 123,
      threadCommentId: {},
      threadId: {},
    };
    expect(() => new ThreadCommentLike(payload)).toThrowError(
      'THREAD_COMMENT_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });
  it('should return thread comment like object correctly', () => {
    const payload = {
      userId: '123',
      threadCommentId: '123',
      threadId: '123',
    };

    const like = new ThreadCommentLike(payload);
    expect(like.userId).toEqual(payload.userId);
    expect(like.threadCommentId).toEqual(payload.threadCommentId);
    expect(like.threadId).toEqual(payload.threadId);
  });
});
