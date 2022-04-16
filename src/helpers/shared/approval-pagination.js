export const defaultSettings = {
  limit: 50,
  offset: 0,
  count: 0
};

export const adjustedOffset = (
  pagination = { ...defaultSettings },
  itemsRemoved = 0
) =>
  pagination.offset !== 1 &&
  pagination.count - itemsRemoved <= pagination.offset * pagination.limit
    ? pagination.offset - 1
    : pagination.offset;
