import { timeAgo } from '../../helpers/shared/helpers';

export const createRows = (data) =>
  data.reduce(
    (acc, { id, name, description, created_at }, key) => [
      ...acc,
      {
        id,
        key,
        isOpen: false,
        cells: [name, description, timeAgo(created_at)]
      }
    ],
    []
  );
