const AddedThreadComment = require('../AddedThreadComment');

describe('AddedThreadCommentEntities', () => {
  it('should throw error when not contain needed property', () => {
    const payload = {
      id: 'id',
      content: 'content',
    };
    expect(() => new AddedThreadComment(payload)).toThrowError(
      'ADDED_THREAD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });
  it('should throw error when not meet data type specification', () => {
    const payload = {
      id: '123',
      content: 123,
      owner: '123',
    };
    expect(() => new AddedThreadComment(payload)).toThrowError(
      'ADDED_THREAD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });
  it('should return added thread comment object correctly', () => {
    const payload = {
      id: 'id',
      content: 'content',
      owner: 'owner',
    };
    const addedThreadComment = new AddedThreadComment(payload);
    expect(addedThreadComment.id).toEqual(payload.id);
    expect(addedThreadComment.content).toEqual(payload.content);
    expect(addedThreadComment.owner).toEqual(payload.owner);
  });
});
