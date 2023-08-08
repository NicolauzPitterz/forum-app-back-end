const FilteredReplies = {
  verifyIsDeletedReplies(replies) {
    const filteredRepliesDetail = replies.map(
      ({ isDelete, content, ...repliesDetail }) => ({
        ...repliesDetail,
        content: isDelete ? '**balasan telah dihapus**' : content,
      }),
    );

    return filteredRepliesDetail;
  },
};

module.exports = FilteredReplies;
