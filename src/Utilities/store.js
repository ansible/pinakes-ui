
import promiseMiddleware from 'redux-promise-middleware';
import { ReducerRegistry, applyReducerHash } from '@red-hat-insights/insights-frontend-components';
import reduxLogger from 'redux-logger';
import thunk from 'redux-thunk';
import addPlatformReducer, { addPlatformInitialState } from '../redux/reducers/addPlatformReducer';
import alertReducer, { alertsInitialState } from '../redux/reducers/alertReducer';
import mainModalReducer, { mainModalInitialState } from '../redux/reducers/mainModalReducer';
import orderReducer, { orderInitialState } from '../redux/reducers/orderReducer';
import platformReducer, { platformInitialState } from '../redux/reducers/platformReducer';
import portfolioReducer, { portfoliosInitialState } from '../redux/reducers/portfolioReducer';
import uiReducer, { uiInitialState } from '../redux/reducers/UiReducer';

const registry = new ReducerRegistry({}, [ promiseMiddleware(), thunk, reduxLogger ]);

registry.register({
  addPlatformReducer: applyReducerHash(addPlatformReducer, addPlatformInitialState),
  alertReducer: applyReducerHash(alertReducer, alertsInitialState),
  mainModalReducer: applyReducerHash(mainModalReducer, mainModalInitialState),
  orderReducer: applyReducerHash(orderReducer, orderInitialState),
  platformReducer: applyReducerHash(platformReducer, platformInitialState),
  portfolioReducer: applyReducerHash(portfolioReducer, portfoliosInitialState),
  uiReducer: applyReducerHash(uiReducer, uiInitialState)
});

export default registry.getStore();
