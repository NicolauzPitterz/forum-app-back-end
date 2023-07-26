const AddThreadUseCase = require('../AddThreadUseCase');
const {
  AddThread,
  AddedThread,
  ThreadRepository,
} = require('../../../Domains');

describe('AddThreadUseCase', () => {
  it('should orchestrating the add thread action correctly', async () => {
    const useCasePayload = {
      title: 'A Thread',
      body: 'A Thread Body',
    };

    const mockAddedThread = new AddedThread({
      id: 'thread-123',
      title: useCasePayload.title,
      owner: 'user-123',
    });

    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.addThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockAddedThread));

    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    const addedThread = await addThreadUseCase.execute(
      useCasePayload,
      'user-123',
    );

    expect(addedThread).toStrictEqual(
      new AddedThread({
        id: 'thread-123',
        title: useCasePayload.title,
        owner: 'user-123',
      }),
    );

    expect(mockThreadRepository.addThread).toBeCalledWith(
      new AddThread({
        title: useCasePayload.title,
        body: useCasePayload.body,
        owner: 'user-123',
      }),
    );
  });
});
