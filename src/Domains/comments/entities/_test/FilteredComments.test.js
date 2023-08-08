const { CommentDetail } = require('../../..');
const FilteredComments = require('../FilteredComments');

it('should operate the branching in the verifyIsDeletedComments function properly', () => {
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
      content: 'A Thread Comment B',
      likeCount: 1,
      isDelete: false,
    }),
  ];

  const filteredCommentsDetail = mockCommentsDetail.map(
    ({ isDelete, ...commentDetail }) => commentDetail,
  );

  const SpyCheckIsDeletedComments = jest.spyOn(
    FilteredComments,
    'verifyIsDeletedComments',
  );

  FilteredComments.verifyIsDeletedComments(mockCommentsDetail);

  expect(SpyCheckIsDeletedComments).toReturnWith([
    { ...filteredCommentsDetail[0], content: '**komentar telah dihapus**' },
    filteredCommentsDetail[1],
  ]);

  SpyCheckIsDeletedComments.mockClear();
});
