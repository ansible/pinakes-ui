import {
  ShareInfo,
  UnsharePolicyPermissionsEnum
} from '@redhat-cloud-services/catalog-client';
import * as ShareHelper from '../../helpers/share/share-helper';
import { AsyncMiddlewareAction } from '../../types/redux';
import * as ActionTypes from '../action-types';

export const fetchShareInfo = (
  portfolioId: string
): AsyncMiddlewareAction<ShareInfo> => ({
  type: ActionTypes.QUERY_PORTFOLIO,
  payload: ShareHelper.getShareInfo(portfolioId)
});

export const sharePortfolio = (
  portfolioData: ShareHelper.ShareData
): AsyncMiddlewareAction<void> => ({
  type: ActionTypes.SHARE_PORTFOLIO,
  payload: ShareHelper.sharePortfolio({
    ...portfolioData
  })
});

export const unsharePortfolio = (
  portfolioData: ShareHelper.ShareData<UnsharePolicyPermissionsEnum[]>
): AsyncMiddlewareAction<void> => ({
  type: ActionTypes.UNSHARE_PORTFOLIO,
  payload: ShareHelper.unsharePortfolio({
    ...portfolioData
  })
});
