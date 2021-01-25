import promiseMiddleware from 'redux-promise-middleware';
import ReducerRegistry, {
  applyReducerHash
} from '@redhat-cloud-services/frontend-components-utilities/files/cjs/ReducerRegistry';
import { notificationsReducer } from '@redhat-cloud-services/frontend-components-notifications/redux';
import notificationsMiddleware from '@redhat-cloud-services/frontend-components-notifications/notificationsMiddleware';

import reduxLogger from 'redux-logger';
import thunk from 'redux-thunk';
import orderReducer, {
  orderInitialState
} from '../redux/reducers/order-reducer';
import platformReducer, {
  platformInitialState
} from '../redux/reducers/platform-reducer';
import orderProcessReducer, {
  orderProcessInitialState
} from '../redux/reducers/order-process-reducer';
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
import i18nReducer, { i18nInitialState } from '../redux/reducers/i18n-reducer';
import viewStateMiddleware from './view-state-middleware';
import unAuthorizedMiddleware from './unauthorized-middleware';
import { Store } from 'redux';

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
  })
];

const baseMiddlewares = [
  thunk,
  promiseMiddleware,
  unAuthorizedMiddleware,
  viewStateMiddleware,
  loadingStateMiddleware,
  emptyDataMiddleware
];
const registerReducers = (registry: ReducerRegistry): void => {
  registry.register({
    orderReducer: applyReducerHash(orderReducer, orderInitialState),
    platformReducer: applyReducerHash(platformReducer, platformInitialState),
    orderProcessReducer: applyReducerHash(
      orderProcessReducer,
      orderProcessInitialState
    ),
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
    i18nReducer: applyReducerHash(i18nReducer, i18nInitialState),
    notifications: notificationsReducer
  });
};

export default (isProd = false): Store => {
  const registry = new ReducerRegistry({}, [
    ...baseMiddlewares,
    ...prodMiddlewares,
    ...(isProd ? [] : [reduxLogger])
  ]);
  registerReducers(registry);
  return registry.getStore() as Store;
};

export const testStore = (): Store => {
  const registry = new ReducerRegistry({}, [...baseMiddlewares]);
  registerReducers(registry);
  return registry.getStore() as Store;
};
