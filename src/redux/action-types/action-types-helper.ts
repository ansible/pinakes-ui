import { StringObject } from '../../types/common-types';

export const createAsyncActionTypes = (
  actionTypes: string[],
  prefix: string
): StringObject =>
  actionTypes
    .reduce<string[]>(
      (acc, curr) => [
        ...acc,
        ...[curr, `${curr}_PENDING`, `${curr}_FULFILLED`, `${curr}_REJECTED`]
      ],
      []
    )
    .reduce(
      (acc, curr) => ({
        ...acc,
        [curr]: `${prefix}${curr}`
      }),
      {}
    );
