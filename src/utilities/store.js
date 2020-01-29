import promiseMiddleware from 'redux-promise-middleware';
import ReducerRegistry, {
  applyReducerHash
} from '@redhat-cloud-services/frontend-components-utilities/files/ReducerRegistry';
import {
  notifications,
  notificationsMiddleware
} from '@redhat-cloud-services/frontend-components-notifications/';

import reduxLogger from 'redux-logger';
import thunk from 'redux-thunk';
import orderReducer, {
  orderInitialState
} from '../redux/reducers/order-reducer';
import platformReducer, {
  platformInitialState
} from '../redux/reducers/platform-reducer';
import portfolioReducer, {
  portfoliosInitialState
} from '../redux/reducers/portfolio-reducer';
import approvalReducer, {
  approvalInitialState
} from '../redux/reducers/approval-reducer';
import rbacReducer, { rbacInitialState } from '../redux/reducers/rbac-reducer';
import shareReducer, {
  shareInfoInitialState
} from '../redux/reducers/share-reducer';
import openApiReducer, {
  openApiInitialState
} from '../redux/reducers/open-api-reducer';
import loadingStateMiddleware from './loading-state-middleware';
import emptyDataMiddleware from './empty-data-middleware';
import breadcrumbsReducer, {
  initialBreadcrumbsState
} from '../redux/reducers/breadcrumbs-reducer';

const prodMiddlewares = [
  notificationsMiddleware({
    errorTitleKey: ['errors', 'message', 'statusText'],
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
  }),
  reduxLogger
];

const baseMiddlewares = [
  thunk,
  promiseMiddleware,
  loadingStateMiddleware,
  emptyDataMiddleware
];
const registerReducers = (registry) => {
  registry.register({
    orderReducer: applyReducerHash(orderReducer, orderInitialState),
    platformReducer: applyReducerHash(platformReducer, platformInitialState),
    portfolioReducer: applyReducerHash(
      portfolioReducer,
      portfoliosInitialState
    ),
    approvalReducer: applyReducerHash(approvalReducer, approvalInitialState),
    rbacReducer: applyReducerHash(rbacReducer, rbacInitialState),
    shareReducer: applyReducerHash(shareReducer, shareInfoInitialState),
    openApiReducer: applyReducerHash(openApiReducer, openApiInitialState),
    breadcrumbsReducer: applyReducerHash(
      breadcrumbsReducer,
      initialBreadcrumbsState
    ),
    notifications
  });
};

export default () => {
  const registry = new ReducerRegistry({}, [
    ...baseMiddlewares,
    ...prodMiddlewares
  ]);
  registerReducers(registry);
  return registry.getStore();
};

export const testStore = () => {
  const registry = new ReducerRegistry({}, [...baseMiddlewares]);
  registerReducers(registry);
  return registry.getStore();
};
