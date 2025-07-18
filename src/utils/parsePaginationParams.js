export const parseNumber = (number, defaultValue) => {
  if (typeof number === 'undefined') return defaultValue;

  const parsedNumber = parseInt(number, 10);
  if (Number.isNaN(parsedNumber)) return defaultValue;

  return parsedNumber;
};

export const parsePaginationParams = (query) => {
  const { page, perPage } = query;

  const parsedPage = parseNumber(page, 1);
  const parsedPerPage = parseNumber(perPage, 12);

  return {
    page: parsedPage,
    perPage: parsedPerPage,
  };
};
