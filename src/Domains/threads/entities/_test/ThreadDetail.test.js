const ThreadDetail = require('../ThreadDetail');

describe('ThreadDetails entities', () => {
  it('should throw error when not contain needed property', () => {
    expect(() => new ThreadDetail({})).toThrowError(
      'THREAD_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });
  it('should throw error when not meet data type specification', () => {
    const payload = {
      id: 123,
      title: 123,
      body: 'body',
      date: 123,
      username: 123,
      comments: [],
    };
    expect(() => new ThreadDetail(payload)).toThrowError(
      'THREAD_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });
  it('should return thread detail object correctly', () => {
    const payload = {
      id: 'thread-h_2FkLZhtgBKY2kh4CC02',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: '2021-08-08T07:19:09.775Z',
      username: 'dicoding',
      comments: [
        {
          id: 'comment-_pby2_tmXV6bcvcdev8xk',
          username: 'johndoe',
          date: '2021-08-08T07:22:33.555Z',
          content: 'sebuah comment',
          likeCount: 2,
        },
        {
          id: 'comment-yksuCoxM2s4MMrZJO-qVD',
          username: 'dicoding',
          date: '2021-08-08T07:26:21.338Z',
          content: '**komentar telah dihapus**',
          likeCount: 2,
        },
      ],
    };

    const threadDetail = new ThreadDetail(payload);

    expect(payload.body).toEqual(threadDetail.body);
    expect(payload.comments).toEqual(threadDetail.comments);
    expect(payload.date).toEqual(threadDetail.date);
    expect(payload.id).toEqual(threadDetail.id);
    expect(payload.title).toEqual(threadDetail.title);
    expect(payload.username).toEqual(threadDetail.username);
  });
});
