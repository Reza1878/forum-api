const DeleteThreadComment = require('../DeleteThreadComment');

describe('DeleteThreadComment entities', () => {
  it('should throw error when not contain needed property', () => {
    expect(() => new DeleteThreadComment({})).toThrowError(
      'DELETE_THREAD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });
  it('should throw error when not meet data type specification', () => {
    const payload = {
      threadId: 123,
      id: 123,
      owner: '!23',
    };
    expect(() => new DeleteThreadComment(payload)).toThrowError(
      'DELETE_THREAD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });
  it('should return delete threasd comment object correctly', () => {
    const payload = {
      threadId: '23',
      owner: '123',
      id: '123',
    };
    const deleteThreadComment = new DeleteThreadComment(payload);
    expect(deleteThreadComment.threadId).toEqual(payload.threadId);
    expect(deleteThreadComment.id).toEqual(payload.id);
    expect(deleteThreadComment.owner).toEqual(payload.owner);
  });
});
