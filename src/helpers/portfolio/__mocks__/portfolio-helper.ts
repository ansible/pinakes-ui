import { ApiCollectionResponse, AnyObject } from '../../../types/common-types';

export const fetchPortfolioByName = (
  name = ''
): Promise<Partial<ApiCollectionResponse<AnyObject>>> => {
  return new Promise((res) => {
    if (name === 'should-conflict') {
      return res({
        data: [{ name: 'should-conflict', id: 'conflict-id' }]
      });
    }

    return res({
      data: [],
      meta: { count: 0, limit: 50, offset: 0 }
    });
  });
};
