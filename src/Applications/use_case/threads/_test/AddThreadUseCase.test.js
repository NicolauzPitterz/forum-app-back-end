const AddThreadUseCase = require('../AddThreadUseCase');
const {
  AddThread,
  AddedThread,
  ThreadRepository,
} = require('../../../../Domains');

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

    mockThreadRepository.addThread = jest.fn().mockImplementation(() =>
      Promise.resolve(
        new AddedThread({
          id: 'thread-123',
          title: 'A Thread',
          owner: 'user-123',
        }),
      ),
    );

    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    const addedThread = await addThreadUseCase.execute(
      useCasePayload,
      'user-123',
    );

    expect(addedThread).toStrictEqual(mockAddedThread);
    expect(mockThreadRepository.addThread).toBeCalledWith(
      new AddThread({
        ...useCasePayload,
        owner: 'user-123',
      }),
    );
  });
});
