const ThreadComment = require('../ThreadComment');

describe('ThreadComment entities', () => {
  it('should throw error when not contain needed property', () => {
    expect(() => new ThreadComment({})).toThrowError(
      'THREAD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });
  it('should throw error when not meet data type specification', () => {
    const payload = {
      content: 123,
      owner: '123',
      threadId: '!23',
    };
    expect(() => new ThreadComment(payload)).toThrowError(
      'THREAD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });
  it('should return thread comment object correctly', () => {
    const payload = {
      content: 'content',
      owner: '123',
      threadId: '123',
    };
    const threadComment = new ThreadComment(payload);
    expect(threadComment.content).toEqual(payload.content);
    expect(threadComment.owner).toEqual(payload.owner);
    expect(threadComment.threadId).toEqual(payload.threadId);
  });
});
