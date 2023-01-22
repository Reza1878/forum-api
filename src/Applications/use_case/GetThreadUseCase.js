class GetThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    this._verifyPayload(useCasePayload);

    const { id } = useCasePayload;
    const thread = await this._threadRepository.getThreadById(id);
    return thread;
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
