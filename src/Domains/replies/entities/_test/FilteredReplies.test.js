const FilteredReplies = require('../FilteredReplies');
const ReplyDetail = require('../ReplyDetail');

it('should operate the branching in the verifyIsDeletedReplies function properly', () => {
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
      commentId: 'comment-123',
      content: 'A Comment Reply B',
      date: '2023',
      username: 'pittersn',
      isDelete: false,
    }),
  ];

  const filteredRepliesDetail = mockRepliesDetail.map(
    ({ isDelete, ...replyDetail }) => replyDetail,
  );

  const SpyCheckIsDeletedReplies = jest.spyOn(
    FilteredReplies,
    'verifyIsDeletedReplies',
  );

  FilteredReplies.verifyIsDeletedReplies(mockRepliesDetail);

  expect(SpyCheckIsDeletedReplies).toReturnWith([
    { ...filteredRepliesDetail[0], content: '**balasan telah dihapus**' },
    filteredRepliesDetail[1],
  ]);

  SpyCheckIsDeletedReplies.mockClear();
});
