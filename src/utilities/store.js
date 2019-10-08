
import promiseMiddleware from 'redux-promise-middleware';
import ReducerRegistry, { applyReducerHash } from '@redhat-cloud-services/frontend-components-utilities/files/ReducerRegistry';
import { notifications, notificationsMiddleware } from '@redhat-cloud-services/frontend-components-notifications/';

import reduxLogger from 'redux-logger';
import thunk from 'redux-thunk';
import orderReducer, { orderInitialState } from '../redux/reducers/order-reducer';
import platformReducer, { platformInitialState } from '../redux/reducers/platform-reducer';
import portfolioReducer, { portfoliosInitialState } from '../redux/reducers/portfolio-reducer';
import approvalReducer, { approvalInitialState } from '../redux/reducers/approval-reducer';
import rbacReducer, { rbacInitialState } from '../redux/reducers/rbac-reducer';
import shareReducer, { shareInfoInitialState } from '../redux/reducers/share-reducer';
import loadingStateMiddleware from './loading-state-middleware';

const registry = new ReducerRegistry({}, [ thunk, promiseMiddleware(), notificationsMiddleware({
  errorTitleKey: [ 'errors', 'message', 'statusText' ],
  errorDescriptionKey: [
    'data.errors[0].detail',
    'data.errors',
    'data.error',
    'data.message',
    'response.body.errors',
    'data',
    'errorMessage',
    'stack'
  ]
}), loadingStateMiddleware, reduxLogger ]);
registry.register({
  orderReducer: applyReducerHash(orderReducer, orderInitialState),
  platformReducer: applyReducerHash(platformReducer, platformInitialState),
  portfolioReducer: applyReducerHash(portfolioReducer, portfoliosInitialState),
  approvalReducer: applyReducerHash(approvalReducer, approvalInitialState),
  rbacReducer: applyReducerHash(rbacReducer, rbacInitialState),
  shareReducer: applyReducerHash(shareReducer, shareInfoInitialState),
  notifications
});

export default registry.getStore();
