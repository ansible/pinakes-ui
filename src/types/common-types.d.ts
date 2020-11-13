import {
  Order,
  OrderItem,
  Portfolio,
  PortfolioItem
} from '@redhat-cloud-services/catalog-client';
import { ReactNode } from 'react';
import { MessageDescriptor } from 'react-intl';
import { PaginationConfiguration } from '../helpers/shared/pagination';

export interface StringObject {
  [key: string]: string;
}

export interface AnyObject {
  [key: string]: any;
}

export interface ApiMetadata extends AnyObject {
  count?: number;
  limit?: number;
  offset?: number;
}

export interface ApiCollectionResponse<
  T /** he type of collection item. For instance Portfolio or Order*/
> {
  data: T[];
  meta: ApiMetadata;
}

export interface RestorePortfolioItemConfig {
  portfolioItemId: string;
  restoreKey?: string;
  restore_key?: string;
}

export interface ActionNotification {
  fulfilled?: AnyObject;
  pending?: AnyObject;
  rejected?: AnyObject;
}

export interface ActionMeta extends PaginationConfiguration, AnyObject {
  storeState?: boolean;
  stateKey?: string;
  notifications?: ActionNotification;
  filters?: StringObject;
  platformId?: string;
}
export interface ReduxAction<T = any> {
  type: string;
  payload?: T;
  meta?: ActionMeta;
}

export type ReduxActionHandler<T /**Reducer state definition */> = (
  state: T,
  action: ReduxAction
) => T;

export interface SelectOption extends AnyObject {
  label?: string;
  value?: any;
  isDisabled?: boolean;
}

export type SelectOptions = SelectOption[];

export type LoadOptions = (value: string) => Promise<SelectOptions>;

export interface InternalResourceObject {
  appName: string;
  objectType: string;
  objectId: string;
}

export type Full<T> = {
  [P in keyof T]-?: T[P];
};

export interface UserCapabilities {
  share?: boolean;
  copy?: boolean;
  unshare?: boolean;
  update?: boolean;
  destroy?: boolean;
  set_approval?: boolean;
}

export interface PortfolioStatistics {
  shared_groups?: number;
  portfolio_items?: number;
}

export interface PortfolioMetadata {
  user_capabilities: UserCapabilities;
  statistics: PortfolioStatistics;
}

export interface EnhancedOrder extends Order {
  orderItem: OrderItem;
}

export type NotificationPayload =
  | {
      type: string;
      payload: {
        dismissable: boolean;
        variant: string;
        title: string;
        description: string;
      };
    }
  | {
      type: string;
      payload: any;
    };
export type FormatMessage = (
  message: MessageDescriptor,
  values?: AnyObject
) => ReactNode;

export interface InternalPortfolio extends Portfolio {
  metadata: PortfolioMetadata;
}

export interface InternalPortfolioItem extends PortfolioItem {
  metadata: {
    user_capabilities?: UserCapabilities;
  };
}
export interface FormApi {
  getState: () => {
    values: AnyObject;
    initialValues: AnyObject;
  };
}

export type ValueOf<T> = T[keyof T];

export interface SortBy {
  index: number;
  property: string,
  direction: SortByDirection
}
