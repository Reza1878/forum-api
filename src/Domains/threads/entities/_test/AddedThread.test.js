const AddedThread = require('../AddedThread');

describe('a AddedThread entities', () => {
  it('should throw error when not contain needed property', () => {
    const payload = {
      title: 'Title',
    };
    expect(() => new AddedThread(payload)).toThrowError(
      'ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });
  it('should throw error when not meet data type specification', () => {
    const payload = {
      id: 1,
      title: 1,
      owner: 1,
    };
    expect(() => new AddedThread(payload)).toThrowError(
      'ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });
  it('should create addedThread object correctly', () => {
    const payload = {
      id: 'id-1',
      title: 'Title',
      owner: 'owner-1',
    };
    const addedThread = new AddedThread(payload);

    expect(addedThread.id).toEqual(payload.id);
    expect(addedThread.title).toEqual(payload.title);
    expect(addedThread.owner).toEqual(payload.owner);
  });
});
