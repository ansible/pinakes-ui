import { PaginationConfiguration } from '../helpers/shared/pagination';
import { StateFromReducersMapObject } from 'redux';

export interface StringObject {
  [key: string]: string;
}

export interface AnyObject {
  [key: string]: any;
}

export interface ApiMetadata {
  count: number;
  limit: number;
  offset: number;
}

export interface ApiCollectionResponse<
  T /** he type of collection item. For instance Portfolio or Order*/
> {
  data: T[];
  meta: ApiMetadata;
}

export interface RestorePortfolioItemConfig {
  portfolioItemId: string;
  restoreKey: string;
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
export interface ReduxAction {
  type: string;
  payload?: any;
  meta: ActionMeta;
}

export type ReduxActionHandler<T /**Reducer state definition */> = (
  state: StateFromReducersMapObject<T>,
  action: ReduxAction
) => T;
