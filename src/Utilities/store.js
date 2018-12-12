
import promiseMiddleware from 'redux-promise-middleware';
import { ReducerRegistry, applyReducerHash } from '@red-hat-insights/insights-frontend-components';
import reduxLogger from 'redux-logger';
import thunk from 'redux-thunk';
import AddPlatformReducer from '../Store/Reducers/AddPlatformStore';
import alertReducer from '../Store/Reducers/AlertReducer';
import MainModalReducer from '../Store/Reducers/MainModalStore';
import OrderReducer from '../Store/Reducers/OrderStore';
import PlatformReducer from '../Store/Reducers/PlatformStore';
import PortfolioReducer from '../Store/Reducers/PortfolioStore';
import uiReducer from '../Store/Reducers/UiReducer';

const registry = new ReducerRegistry({}, [ promiseMiddleware(), thunk, reduxLogger ]);

registry.register({
  AddPlatformReducer,
  AlertReducer: alertReducer,
  MainModalStore: MainModalReducer,
  OrderStore: OrderReducer,
  PlatformStore: PlatformReducer,
  PortfolioStore: PortfolioReducer,
  uiReducer
});

export default registry.getStore();
