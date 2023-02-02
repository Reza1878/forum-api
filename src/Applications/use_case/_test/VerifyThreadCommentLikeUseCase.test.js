/* eslint-disable function-paren-newline */
/* eslint-disable implicit-arrow-linebreak */
const VerifyThreadCommentLikeUseCase = require('../VerifyThreadCommentLikeUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const ThreadCommentRepository = require('../../../Domains/thread-comments/ThreadCommentRepository');
const ThreadCommentLikeRepository = require('../../../Domains/thread-comment-likes/ThreadCommentLikeRepository');

describe('VerifyThreadCommentLikeUseCase', () => {
  it('should throw NotFoundError when give invalid thread id', async () => {
    const useCasePayload = {
      threadId: 'xxx',
      threadCommentId: 'comment-123',
      userId: 'user-123',
    };

    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.verifyThreadAvailability = jest
      .fn()
      .mockImplementation(() =>
        Promise.reject(new NotFoundError('Thread not found')),
      );

    const mockVerifyThreadCommentLikeUseCase =
      new VerifyThreadCommentLikeUseCase({
        threadRepository: mockThreadRepository,
      });

    await expect(
      mockVerifyThreadCommentLikeUseCase.execute(useCasePayload),
    ).rejects.toThrowError(new NotFoundError('Thread not found'));
    expect(mockThreadRepository.verifyThreadAvailability).toBeCalledWith(
      useCasePayload.threadId,
    );
  });

  it('should throw NotFoundError when give invalid thread comment id', async () => {
    const useCasePayload = {
      threadId: 'thread-123',
      threadCommentId: 'xxx',
      userId: 'user-123',
    };

    const mockThreadCommentRepository = new ThreadCommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.verifyThreadAvailability = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadCommentRepository.verifyThreadCommentAvailability = jest
      .fn()
      .mockImplementation(() =>
        Promise.reject(new NotFoundError('Thread comment not found')),
      );

    const mockVerifyThreadCommentLikeUseCase =
      new VerifyThreadCommentLikeUseCase({
        threadCommentRepository: mockThreadCommentRepository,
        threadRepository: mockThreadRepository,
      });

    await expect(
      mockVerifyThreadCommentLikeUseCase.execute(useCasePayload),
    ).rejects.toThrowError(new NotFoundError('Thread comment not found'));
    expect(
      mockThreadCommentRepository.verifyThreadCommentAvailability,
    ).toBeCalledWith(useCasePayload.threadCommentId);
  });

  it('should orchestrating like thread comment action correctly', async () => {
    const useCasePayload = {
      threadId: 'thread-123',
      threadCommentId: 'comment-123',
      userId: 'user-123',
    };

    const mockThreadCommentRepository = new ThreadCommentRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockThreadCommentLikeRepository = new ThreadCommentLikeRepository();

    mockThreadRepository.verifyThreadAvailability = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadCommentRepository.verifyThreadCommentAvailability = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadCommentLikeRepository.verifyCommentLikes = jest
      .fn()
      .mockImplementation(() => Promise.resolve(true));

    const mockVerifyThreadCommentLikeUseCase =
      new VerifyThreadCommentLikeUseCase({
        threadCommentRepository: mockThreadCommentRepository,
        threadRepository: mockThreadRepository,
        threadCommentLikeRepository: mockThreadCommentLikeRepository,
      });

    const res = await mockVerifyThreadCommentLikeUseCase.execute(
      useCasePayload,
    );

    expect(
      mockVerifyThreadCommentLikeUseCase.execute(useCasePayload),
    ).resolves.not.toThrowError(NotFoundError);
    expect(mockThreadCommentLikeRepository.verifyCommentLikes).toBeCalledWith(
      useCasePayload,
    );
    expect(res).toBe(true);
  });
  it('should orchestrating like thread comment action correctly', async () => {
    const useCasePayload = {
      threadId: 'thread-123',
      threadCommentId: 'comment-123',
      userId: 'user-123',
    };

    const mockThreadCommentRepository = new ThreadCommentRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockThreadCommentLikeRepository = new ThreadCommentLikeRepository();

    mockThreadRepository.verifyThreadAvailability = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadCommentRepository.verifyThreadCommentAvailability = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadCommentLikeRepository.verifyCommentLikes = jest
      .fn()
      .mockImplementation(() => Promise.resolve(false));

    const mockVerifyThreadCommentLikeUseCase =
      new VerifyThreadCommentLikeUseCase({
        threadCommentRepository: mockThreadCommentRepository,
        threadRepository: mockThreadRepository,
        threadCommentLikeRepository: mockThreadCommentLikeRepository,
      });

    const res = await mockVerifyThreadCommentLikeUseCase.execute(
      useCasePayload,
    );

    expect(
      mockVerifyThreadCommentLikeUseCase.execute(useCasePayload),
    ).resolves.not.toThrowError(NotFoundError);
    expect(mockThreadCommentLikeRepository.verifyCommentLikes).toBeCalledWith(
      useCasePayload,
    );
    expect(res).toBe(false);
  });
});
