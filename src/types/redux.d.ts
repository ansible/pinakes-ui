import { OrderReducerState } from '../redux/reducers/order-reducer';
import { PlatformReducerState } from '../redux/reducers/platform-reducer';
import { OrderProcessReducerState } from '../redux/reducers/order-process-reducer';
import { PortfolioReducerState } from '../redux/reducers/portfolio-reducer';
import { RbacReducerState } from '../redux/reducers/rbac-reducer';
import { OpenApiReducerState } from '../redux/reducers/open-api-reducer';
import { I18nReducerState } from '../redux/reducers/i18n-reducer';
import { ApprovalReducerState } from '../redux/reducers/approval-reducer';
import { ShareReducerState } from '../redux/reducers/share-reducer';
import { BreadcrumbsReducerState } from '../redux/reducers/breadcrumbs-reducer';
import { FluxStandardAction } from 'redux-promise-middleware';

export interface CatalogRootState {
  orderReducer: OrderReducerState;
  platformReducer: PlatformReducerState;
  orderProcessReducer: OrderProcessReducerState;
  portfolioReducer: PortfolioReducerState;
  approvalReducer: ApprovalReducerState;
  rbacReducer: RbacReducerState;
  shareReducer: ShareReducerState;
  openApiReducer: OpenApiReducerState;
  breadcrumbsReducer: BreadcrumbsReducerState;
  i18nReducer: I18nReducerState;
}

export interface AsyncMiddlewareAction<T = any>
  extends Omit<FluxStandardAction, 'payload'> {
  type?: string;
  payload?: Promise<T>;
}

export type GetReduxState = () => CatalogRootState;
