const {
  ThreadDetail,
  ThreadRepository,
  CommentRepository,
  CommentDetail,
} = require('../../../Domains');
const GetThreadDetailUseCase = require('../GetThreadDetailUseCase');

describe('GetThreadDetailUseCase', () => {
  it('should orchestrating the get thread detail action correctly', async () => {
    const useCaseParam = {
      threadId: 'thread-123',
    };

    const mockThreadDetail = new ThreadDetail({
      id: 'thread-123',
      title: 'A Thread',
      body: 'A Thread Body',
      date: '2023',
      username: 'nicolauzp',
      comments: [],
    });

    const mockCommentsDetail = [
      new CommentDetail({
        id: 'comment-123',
        username: 'nicolauzp',
        date: '2023',
        content: 'A Thread A',
        isDelete: false,
      }),
      new CommentDetail({
        id: 'comment-456',
        username: 'pittersn',
        date: '2023',
        content: 'A Thread B',
        isDelete: false,
      }),
    ];

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.getThreadDetailById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockThreadDetail));
    mockCommentRepository.getCommentsByThreadId = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockCommentsDetail));

    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    const filteredCommentsDetail = mockCommentsDetail.map(
      ({ isDelete, ...commentDetail }) => commentDetail,
    );

    getThreadDetailUseCase.verifyIsDeletedComments = jest
      .fn()
      .mockImplementation(() => filteredCommentsDetail);

    const useCaseResult = await getThreadDetailUseCase.execute(useCaseParam);

    expect(useCaseResult).toEqual(
      new ThreadDetail({
        ...mockThreadDetail,
        comments: filteredCommentsDetail,
      }),
    );
    expect(mockThreadRepository.getThreadDetailById).toBeCalledWith(
      useCaseParam.threadId,
    );
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(
      useCaseParam.threadId,
    );
    expect(getThreadDetailUseCase.verifyIsDeletedComments).toBeCalledWith(
      mockCommentsDetail,
    );
  });

  it('should operate the branching in the verifyIsDeletedComments function properly', () => {
    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      threadRepository: {},
      commentRepository: {},
    });

    const mockCommentsDetail = [
      new CommentDetail({
        id: 'comment-123',
        username: 'nicolauzp',
        date: '2023',
        content: 'A Thread A',
        isDelete: true,
      }),
      new CommentDetail({
        id: 'comment-456',
        username: 'pittersn',
        date: '2023',
        content: 'A Thread B',
        isDelete: false,
      }),
    ];

    const filteredCommentsDetail = mockCommentsDetail.map(
      ({ isDelete, ...commentDetail }) => commentDetail,
    );

    const SpyCheckIsDeletedComments = jest.spyOn(
      getThreadDetailUseCase,
      'verifyIsDeletedComments',
    );

    getThreadDetailUseCase.verifyIsDeletedComments(mockCommentsDetail);

    expect(SpyCheckIsDeletedComments).toReturnWith([
      { ...filteredCommentsDetail[0], content: '**komentar telah dihapus**' },
      filteredCommentsDetail[1],
    ]);

    SpyCheckIsDeletedComments.mockClear();
  });
});
