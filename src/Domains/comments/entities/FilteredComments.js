const FilteredComments = {
  verifyIsDeletedComments(comments) {
    const filteredCommentsDetail = comments.map(
      ({ isDelete, content, ...commentDetail }) => ({
        ...commentDetail,
        content: isDelete ? '**komentar telah dihapus**' : content,
      }),
    );

    return filteredCommentsDetail;
  },
};

module.exports = FilteredComments;
