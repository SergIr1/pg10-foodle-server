const parseSortBy = (value) => {
  const allowedFields = ['_id', 'title', 'category', 'createdAt'];
  if (!value || !allowedFields.includes(value)) return '_id';
  return value;
};

const parseSortOrder = (value) => {
  return value === 'desc' ? -1 : 1;
};

export const parseSortParams = (query) => {
  const { sortBy, sortOrder } = query;

  return {
    sortBy: parseSortBy(sortBy),
    sortOrder: parseSortOrder(sortOrder),
  };
};
