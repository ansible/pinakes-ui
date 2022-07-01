import {
  Order,
  OrderItem,
  Portfolio,
  PortfolioItem
} from '@redhat-cloud-services/catalog-client';
import { ReactNode } from 'react';
import { MessageDescriptor } from 'react-intl';
import { PaginationConfiguration } from '../helpers/shared/pagination';
import { SortByDirection } from '@patternfly/react-table';
import { Source } from '@redhat-cloud-services/sources-client';

export interface StringObject {
  [key: string]: string;
}

export interface AnyObject {
  [key: string]: any;
}

export interface ApiCollectionResponse<
  T /** he type of collection item. For instance Portfolio or Order*/
> {
  results: T[];
  count?: number;
  pageSize?: number;
  page?: number;
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
  tags?: boolean;
}

export interface PortfolioStatistics {
  shared_groups?: number;
  approval_processes?: number;
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
    orderable?: boolean;
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
  property: string;
  direction: SortByDirection;
}

export interface SourceDetails extends Source {
  availability_status?: string;
  enabled?: boolean;
  created_at: string;
  info?: { version?: string; ansible_version?: string; url?: string };
  last_available_at?: string;
  last_checked_at?: string;
  last_refresh_message: string;
  availability_message: string;
  last_successful_refresh_at: string;
  cloud_connector_id: string;
  refresh_finished_at: string;
  refresh_started_at: string;
  refresh_state: string;
  refresh_task_id: string;
  updated_at: string;
}
