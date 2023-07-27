const GetThreadDetailUseCase = require('../GetThreadDetailUseCase');
const {
  ThreadDetail,
  ThreadRepository,
  CommentRepository,
  CommentDetail,
  ReplyDetail,
  ReplyRepository,
} = require('../../../Domains');

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
        replies: [],
        content: 'A Thread A',
        isDelete: false,
      }),
      new CommentDetail({
        id: 'comment-456',
        username: 'pittersn',
        date: '2023',
        replies: [],
        content: 'A Thread B',
        isDelete: false,
      }),
    ];

    const mockRepliesDetail = [
      new ReplyDetail({
        id: 'reply-123',
        commentId: 'comment-123',
        content: 'A Comment Reply A',
        date: '2023',
        username: 'nicolauzp',
        isDelete: false,
      }),
      new ReplyDetail({
        id: 'reply-456',
        commentId: 'comment-123',
        content: 'A Comment Reply B',
        date: '2023',
        username: 'pittersn',
        isDelete: false,
      }),
    ];

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    mockThreadRepository.getThreadDetailById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockThreadDetail));
    mockCommentRepository.getCommentsByThreadId = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockCommentsDetail));
    mockReplyRepository.getRepliesByThreadId = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockRepliesDetail));

    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    const filteredCommentsDetail = mockCommentsDetail.map(
      ({ isDelete, ...commentDetail }) => commentDetail,
    );
    const filteredRepliesDetail = mockRepliesDetail.map(
      ({ isDelete, ...replyDetail }) => replyDetail,
    );
    const expectedCommentsAndReplies = [
      { ...filteredCommentsDetail[0], replies: [filteredRepliesDetail[0]] },
      { ...filteredCommentsDetail[1], replies: [filteredRepliesDetail[1]] },
    ];

    getThreadDetailUseCase.verifyIsDeletedComments = jest
      .fn()
      .mockImplementation(() => filteredCommentsDetail);
    getThreadDetailUseCase.getCommentReplies = jest
      .fn()
      .mockImplementation(() => expectedCommentsAndReplies);

    const useCaseResult = await getThreadDetailUseCase.execute(useCaseParam);

    expect(useCaseResult).toEqual(
      new ThreadDetail({
        ...mockThreadDetail,
        comments: expectedCommentsAndReplies,
      }),
    );
    expect(mockThreadRepository.getThreadDetailById).toBeCalledWith(
      useCaseParam.threadId,
    );
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(
      useCaseParam.threadId,
    );
    expect(mockReplyRepository.getRepliesByThreadId).toBeCalledWith(
      useCaseParam.threadId,
    );
    expect(getThreadDetailUseCase.verifyIsDeletedComments).toBeCalledWith(
      mockCommentsDetail,
    );
    expect(getThreadDetailUseCase.getCommentReplies).toBeCalledWith(
      filteredCommentsDetail,
      mockRepliesDetail,
    );
  });

  it('should operate the branching in the verifyIsDeletedComments function properly', () => {
    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      threadRepository: {},
      commentRepository: {},
      replyRepository: {},
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

  it('should operate the branching in the getCommentReplies function properly', () => {
    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      threadRepository: {},
      commentRepository: {},
      replyRepository: {},
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

    const mockRepliesDetail = [
      new ReplyDetail({
        id: 'reply-123',
        commentId: 'comment-123',
        content: 'A Comment Reply A',
        date: '2023',
        username: 'nicolauzp',
        isDelete: true,
      }),
      new ReplyDetail({
        id: 'reply-456',
        commentId: 'comment-456',
        content: 'A Comment Reply B',
        date: '2023',
        username: 'pittersn',
        isDelete: false,
      }),
    ];

    const filteredCommentsDetail = mockCommentsDetail.map(
      ({ isDelete, ...commentDetail }) => commentDetail,
    );
    const filteredRepliesDetail = mockRepliesDetail.map(
      ({ isDelete, ...replyDetail }) => replyDetail,
    );
    const expectedCommentsAndReplies = [
      {
        ...filteredCommentsDetail[0],
        replies: [
          { ...filteredRepliesDetail[0], content: '**balasan telah dihapus**' },
        ],
      },
      { ...filteredCommentsDetail[1], replies: [filteredRepliesDetail[1]] },
    ];

    const SpyGetCommentReplies = jest.spyOn(
      getThreadDetailUseCase,
      'getCommentReplies',
    );

    getThreadDetailUseCase.getCommentReplies(
      filteredCommentsDetail,
      mockRepliesDetail,
    );

    expect(SpyGetCommentReplies).toReturnWith(expectedCommentsAndReplies);

    SpyGetCommentReplies.mockClear();
  });
});
