const Thread = require('../Thread');

describe('Thread entities', () => {
  it('should throw error when not contain needed property', () => {
    const payload = {
      title: 'title',
    };

    expect(() => new Thread(payload)).toThrowError(
      'THREAD.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });
  it('should throw error when not meet data type specification', () => {
    const payload = {
      title: 123,
      body: 123,
      owner: '123',
    };
    expect(() => new Thread(payload)).toThrowError(
      'THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });
  it('should create thread object correctly', () => {
    const payload = {
      title: 'title',
      body: 'body',
      owner: 'owner',
    };

    const addThread = new Thread(payload);
    expect(addThread.title).toEqual(payload.title);
    expect(addThread.body).toEqual(payload.body);
    expect(addThread.owner).toEqual(payload.owner);
  });
});
