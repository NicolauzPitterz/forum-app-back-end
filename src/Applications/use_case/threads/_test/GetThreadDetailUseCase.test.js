const GetThreadDetailUseCase = require('../GetThreadDetailUseCase');
const {
  ThreadDetail,
  ThreadRepository,
  CommentRepository,
  CommentDetail,
  ReplyDetail,
  ReplyRepository,
  FilteredComments,
  FilteredReplies,
  CommentReplies,
  LikeRepository,
} = require('../../../../Domains');

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
        content: 'A Thread Comment A',
        likeCount: 0,
        isDelete: false,
      }),
      new CommentDetail({
        id: 'comment-456',
        username: 'pittersn',
        date: '2023',
        replies: [],
        content: 'A Thread Comment B',
        likeCount: 0,
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
    const mockLikeRepository = new LikeRepository();

    mockThreadRepository.getThreadDetailById = jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve({
          id: 'thread-123',
          title: 'A Thread',
          body: 'A Thread Body',
          date: '2023',
          username: 'nicolauzp',
        }),
      );
    mockCommentRepository.getCommentsByThreadId = jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve([
          {
            id: 'comment-123',
            username: 'nicolauzp',
            date: '2023',
            content: 'A Thread Comment A',
            likeCount: 2,
            isDelete: false,
          },
          {
            id: 'comment-456',
            username: 'pittersn',
            date: '2023',
            content: 'A Thread Comment B',
            likeCount: 1,
            isDelete: false,
          },
        ]),
      );
    mockLikeRepository.getLikesByCommentId = jest
      .fn()
      .mockImplementation(() => Promise.resolve(0));
    mockReplyRepository.getRepliesByThreadId = jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve([
          {
            id: 'reply-123',
            commentId: 'comment-123',
            content: 'A Comment Reply A',
            date: '2023',
            username: 'nicolauzp',
            isDelete: false,
          },
          {
            id: 'reply-456',
            commentId: 'comment-123',
            content: 'A Comment Reply B',
            date: '2023',
            username: 'pittersn',
            isDelete: false,
          },
        ]),
      );

    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
      likeRepository: mockLikeRepository,
    });

    const filteredCommentsDetail = mockCommentsDetail.map(
      ({ isDelete, ...commentDetail }) => commentDetail,
    );
    const filteredRepliesDetail = mockRepliesDetail.map(
      ({ isDelete, ...replyDetail }) => replyDetail,
    );
    const expectedCommentsAndReplies = [
      { ...filteredCommentsDetail[0], replies: filteredRepliesDetail },
      { ...filteredCommentsDetail[1], replies: [] },
    ];

    const useCaseResult = await getThreadDetailUseCase.execute(useCaseParam);

    const filteredComments =
      FilteredComments.verifyIsDeletedComments(mockCommentsDetail);
    const filteredReplies =
      FilteredReplies.verifyIsDeletedReplies(mockRepliesDetail);
    const commentReplies = CommentReplies.getCommentReplies(
      filteredComments,
      filteredReplies,
    );

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
    expect(filteredComments).toStrictEqual(filteredCommentsDetail);
    expect(filteredReplies).toStrictEqual(filteredRepliesDetail);
    expect(commentReplies).toStrictEqual(expectedCommentsAndReplies);
  });
});
