/* eslint-disable function-paren-newline */
/* eslint-disable implicit-arrow-linebreak */

const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const ThreadCommentRepository = require('../../../Domains/thread-comments/ThreadCommentRepository');
const ThreadCommentLikeRepository = require('../../../Domains/thread-comment-likes/ThreadCommentLikeRepository');
const DislikeThreadCommentUseCase = require('../DislikeThreadCommentUseCase');

describe('DislikeThreadCommentUseCase', () => {
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

    const mockDislikeThreadCommentUseCase = new DislikeThreadCommentUseCase({
      threadRepository: mockThreadRepository,
    });
    await expect(
      mockDislikeThreadCommentUseCase.execute(useCasePayload),
    ).rejects.toThrowError(new NotFoundError('Thread not found'));
  });

  it('should throw NotFoundError when give invalid thread comment id', async () => {
    const useCasePayload = {
      threadId: 'thnread-123',
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

    const mockDislikeThreadCommentUseCase = new DislikeThreadCommentUseCase({
      threadRepository: mockThreadRepository,
      threadCommentRepository: mockThreadCommentRepository,
    });

    await expect(
      mockDislikeThreadCommentUseCase.execute(useCasePayload),
    ).rejects.toThrowError(new NotFoundError('Thread comment not found'));
  });

  it('should orchestrating dislike thread comment action correctly', async () => {
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
    mockThreadCommentLikeRepository.deleteThreadCommentLike = jest
      .fn()
      .mockImplementation((payload) => Promise.resolve(payload));

    const mockDislikeThreadCommentUseCase = new DislikeThreadCommentUseCase({
      threadCommentRepository: mockThreadCommentRepository,
      threadRepository: mockThreadRepository,
      threadCommentLikeRepository: mockThreadCommentLikeRepository,
    });

    await expect(
      mockDislikeThreadCommentUseCase.execute(useCasePayload),
    ).resolves.not.toThrowError(NotFoundError);
    expect(
      mockThreadCommentLikeRepository.deleteThreadCommentLike,
    ).toBeCalledWith(useCasePayload);
  });
});
