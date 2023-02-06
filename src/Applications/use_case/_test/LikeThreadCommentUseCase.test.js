/* eslint-disable function-paren-newline */
/* eslint-disable implicit-arrow-linebreak */
const LikeThreadCommentUseCase = require('../LikeThreadCommentUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const ThreadCommentRepository = require('../../../Domains/thread-comments/ThreadCommentRepository');
const ThreadCommentLikeRepository = require('../../../Domains/thread-comment-likes/ThreadCommentLikeRepository');

describe('LikeThreadCommentUseCase', () => {
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

    const mockLikeThreadCommentUseCase = new LikeThreadCommentUseCase({
      threadRepository: mockThreadRepository,
    });

    await expect(
      mockLikeThreadCommentUseCase.execute(useCasePayload),
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

    const mockLikeThreadCommentUseCase = new LikeThreadCommentUseCase({
      threadCommentRepository: mockThreadCommentRepository,
      threadRepository: mockThreadRepository,
    });

    await expect(
      mockLikeThreadCommentUseCase.execute(useCasePayload),
    ).rejects.toThrowError(new NotFoundError('Thread comment not found'));
    expect(mockThreadRepository.verifyThreadAvailability).toBeCalledWith(
      useCasePayload.threadId,
    );
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
    mockThreadCommentLikeRepository.addThreadCommentLike = jest
      .fn()
      .mockImplementation((payload) => Promise.resolve(payload));

    const mockLikeThreadCommentUseCase = new LikeThreadCommentUseCase({
      threadCommentRepository: mockThreadCommentRepository,
      threadRepository: mockThreadRepository,
      threadCommentLikeRepository: mockThreadCommentLikeRepository,
    });

    await expect(
      mockLikeThreadCommentUseCase.execute(useCasePayload),
    ).resolves.not.toThrowError(NotFoundError);
    expect(mockThreadRepository.verifyThreadAvailability).toBeCalledWith(
      useCasePayload.threadId,
    );
    expect(
      mockThreadCommentRepository.verifyThreadCommentAvailability,
    ).toBeCalledWith(useCasePayload.threadCommentId);
    expect(mockThreadCommentLikeRepository.addThreadCommentLike).toBeCalledWith(
      useCasePayload,
    );
  });
});
