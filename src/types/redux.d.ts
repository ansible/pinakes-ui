import { OrderReducerState } from '../redux/reducers/order-reducer';
import { PlatformReducerState } from '../redux/reducers/platform-reducer';
import { OrderProcessReducerState } from '../redux/reducers/order-process-reducer';
import { PortfolioReducerState } from '../redux/reducers/portfolio-reducer';
import { RbacReducerState } from '../redux/reducers/rbac-reducer';
import { OpenApiReducerState } from '../redux/reducers/open-api-reducer';
import { I18nReducerState } from '../redux/reducers/i18n-reducer';

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
