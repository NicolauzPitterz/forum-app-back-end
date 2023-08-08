const { CommentDetail, ReplyDetail, CommentReplies } = require('../../..');

it('should operate the branching in the getCommentReplies function properly', () => {
  const mockCommentsDetail = [
    new CommentDetail({
      id: 'comment-123',
      username: 'nicolauzp',
      date: '2023',
      replies: [],
      content: 'A Thread Comment A',
      likeCount: 2,
      isDelete: true,
    }),
    new CommentDetail({
      id: 'comment-456',
      username: 'pittersn',
      date: '2023',
      replies: [],
      content: 'A Thread CommentB',
      likeCount: 1,
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
    ({ isDelete, content, ...commentDetail }) => ({
      ...commentDetail,
      content: isDelete ? '**komentar telah dihapus**' : content,
    }),
  );
  const filteredRepliesDetail = mockRepliesDetail.map(
    ({ isDelete, content, ...replyDetail }) => ({
      ...replyDetail,
      content: isDelete ? '**balasan telah dihapus**' : content,
    }),
  );
  const expectedCommentsAndReplies = [
    {
      ...filteredCommentsDetail[0],
      replies: [filteredRepliesDetail[0]],
    },
    { ...filteredCommentsDetail[1], replies: [filteredRepliesDetail[1]] },
  ];

  const SpyGetCommentReplies = jest.spyOn(CommentReplies, 'getCommentReplies');

  CommentReplies.getCommentReplies(
    filteredCommentsDetail,
    filteredRepliesDetail,
  );

  expect(SpyGetCommentReplies).toReturnWith(expectedCommentsAndReplies);

  SpyGetCommentReplies.mockClear();
});
