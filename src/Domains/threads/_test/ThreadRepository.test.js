const ThreadRepository = require('../ThreadRepository');

describe('ThreadRepository interface', () => {
  it('should throw error when invoke absstract behavior', async () => {
    const threadRepository = new ThreadRepository();

    await expect(threadRepository.addThread({})).rejects.toThrowError(
      'THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED',
    );
    await expect(threadRepository.getThreadById(1)).rejects.toThrowError(
      'THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED',
    );
    await expect(
      threadRepository.verifyThreadAvailability(1),
    ).rejects.toThrowError('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
