const ThreadCommentDetail = require('../ThreadCommentDetail');

describe('ThreadCommentDetail entities', () => {
  it('should throw error when not contain needed property', () => {
    expect(() => new ThreadCommentDetail({})).toThrowError(
      'THREAD_COMMENT_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });
  it('should throw error when not meet data type specification', () => {
    const payload = {
      content: 123,
      username: '123',
      id: '123',
      date: '2022-12-01',
      likeCount: '0',
    };
    expect(() => new ThreadCommentDetail(payload)).toThrowError(
      'THREAD_COMMENT_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });
  it('should return thread comment object correctly', () => {
    const payload = {
      content: 'test',
      username: '123',
      id: '123',
      date: '2022-12-01',
      likeCount: 0,
    };
    const threadComment = new ThreadCommentDetail(payload);
    expect(threadComment.content).toEqual(payload.content);
    expect(threadComment.username).toEqual(payload.username);
    expect(threadComment.date).toEqual(payload.date);
    expect(threadComment.likeCount).toEqual(payload.likeCount);
    expect(threadComment.id).toEqual(payload.id);
  });
  it('should return deleted thread comment object correctly', () => {
    const payload = {
      content: 'test',
      username: '123',
      id: '123',
      date: '2022-12-01',
      is_delete: true,
      likeCount: 0,
    };
    const threadComment = new ThreadCommentDetail(payload);
    expect(threadComment.content).toEqual('**komentar telah dihapus**');
    expect(threadComment.username).toEqual(payload.username);
    expect(threadComment.date).toEqual(payload.date);
    expect(threadComment.likeCount).toEqual(payload.likeCount);
    expect(threadComment.id).toEqual(payload.id);
  });
});
