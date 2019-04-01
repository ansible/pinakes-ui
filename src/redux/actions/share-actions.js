import * as ShareHelper from '../../helpers/share/share-helper';
import * as ActionTypes from '../action-types';

export const fetchShareInfo = (portfolioId) => ({
  type: ActionTypes.QUERY_PORTFOLIO,
  payload: ShareHelper.getShareInfo(portfolioId)
});

export const sharePortfolio = (portfolioData) => ({
  type: ActionTypes.SHARE_PORTFOLIO,
  payload: ShareHelper.sharePortfolio({
    ...portfolioData
  }),
  meta: {
    notifications: {
      fulfilled: {
        variant: 'success',
        title: 'Success updating portfolio',
        description: 'The portfolio was shared successfully.'
      },
      rejected: {
        variant: 'danger',
        title: 'Failed updating portfolio',
        description: 'The portfolio was not shared successfully.'
      }
    }
  }
});

export const unsharePortfolio = (portfolioData) => ({
  type: ActionTypes.UNSHARE_PORTFOLIO,
  payload: ShareHelper.unsharePortfolio({
    ...portfolioData
  }),
  meta: {
    notifications: {
      fulfilled: {
        variant: 'success',
        title: 'Success updating portfolio',
        description: 'The portfolio was unshared successfully.'
      },
      rejected: {
        variant: 'danger',
        title: 'Failed updating portfolio',
        description: 'The portfolio was not unshared successfully.'
      }
    }
  }
});
