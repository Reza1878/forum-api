class GetThreadUseCase {
  constructor({ threadRepository, threadCommentRepository }) {
    this._threadRepository = threadRepository;
    this._threadCommentRepository = threadCommentRepository;
  }

  async execute(useCasePayload) {
    this._verifyPayload(useCasePayload);

    const { id } = useCasePayload;
    const thread = await this._threadRepository.getThreadById(id);
    const comments =
      await this._threadCommentRepository.getThreadCommentByThreadId(id);
    return { ...thread, comments };
  }

  // eslint-disable-next-line class-methods-use-this
  _verifyPayload({ id }) {
    if (!id) {
      throw new Error('GET_THREAD_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
    }
    if (typeof id !== 'string') {
      throw new Error('GET_THREAD_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = GetThreadUseCase;
