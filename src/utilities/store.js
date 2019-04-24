
import promiseMiddleware from 'redux-promise-middleware';
import { ReducerRegistry, applyReducerHash } from '@red-hat-insights/insights-frontend-components';
import { notifications, notificationsMiddleware } from '@red-hat-insights/insights-frontend-components/components/Notifications';

import reduxLogger from 'redux-logger';
import thunk from 'redux-thunk';
import orderReducer, { orderInitialState } from '../redux/reducers/order-reducer';
import platformReducer, { platformInitialState } from '../redux/reducers/platform-reducer';
import portfolioReducer, { portfoliosInitialState } from '../redux/reducers/portfolio-reducer';
import approvalReducer, { approvalInitialState } from '../redux/reducers/approval-reducer';
import rbacReducer, { rbacInitialState } from '../redux/reducers/rbac-reducer';
import shareReducer, { shareInfoInitialState } from '../redux/reducers/share-reducer';

const registry = new ReducerRegistry({}, [ thunk, promiseMiddleware(), notificationsMiddleware({
  errorTitleKey: [ 'errors', 'message', 'statusText' ],
  errorDescriptionKey: [ 'data', 'response.body.errors', 'errors', 'stack' ]
}), reduxLogger ]);

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
