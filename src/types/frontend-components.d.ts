/**
 * These modules are not 100% accurate. It has to be fixed in FCE directly to provide 100% match.
 */

interface InternalAnyObject {
  [key: string]: any;
}

interface InternalStringObject {
  [key: string]: string;
}

declare enum SortByDirection {
  asc = 'asc',
  desc = 'desc'
}

interface InternalApiMetadata {
  count?: number;
  limit?: number;
  offset?: number;
}

type InternalAction = (type: string, ...args: any[]) => void;

interface InternalDispatch<A extends InternalAction> {
  <T extends A>(action: T): T;
}

interface PaginationConfiguration extends InternalApiMetadata {
  filter?: string;
  sortDirection?: SortByDirection;
}
interface ActionNotification {
  fulfilled?: InternalAnyObject;
  pending?: InternalAnyObject;
  rejected?: InternalAnyObject;
}

interface ActionMeta extends PaginationConfiguration, InternalAnyObject {
  storeState?: boolean;
  stateKey?: string;
  notifications?: ActionNotification;
  filters?: InternalStringObject;
  platformId?: string;
}
interface ReduxAction {
  type: string;
  payload?: any;
  meta: ActionMeta;
}

type ReducerHandler<T> = (state: T, action: ReduxAction) => T;
interface ReducerHandlerObject {
  [key: string]: ReducerHandler<any>;
}
type InternalReducerHash<T> = (
  reducerHash: ReducerHandlerObject,
  initialState: InternalAnyObject
) => ReducerHandler<T>;

/**
 * Frontend components do not provide TS typings so we have to define them
 */
declare module '@redhat-cloud-services/frontend-components/components/cjs/DateFormat' {
  export interface DateFormatTooltipProps {
    [key: string]: number | string;
  }
  export interface DateFormatProps {
    date: Date | string | number;
    type?: 'exact' | 'onlyDate' | 'relative';
    extraTitle?: string;
    tooltipProps?: DateFormatTooltipProps;
  }
  export const DateFormat: React.ComponentType<DateFormatProps>;
}

declare module '@redhat-cloud-services/frontend-components-utilities/files/cjs/ReducerRegistry' {
  export type ApplyReducerHash<T> = InternalReducerHash<T>;
  export function applyReducerHash<T>(
    reducer: ReducerHandlerObject,
    initialState: T
  ): ReducerHandler<T>;

  class ReducerRegistry {
    store: InternalAnyObject;
    constructor(
      initState?: InternalAnyObject,
      middlewares?: any[],
      composeEnhancersDefault?: (...args: any[]) => ReducerRegistry
    );
    getStore: () => InternalAnyObject;
    register<T>(newReducers: ReducerHandlerObject): void;
  }

  export const reducerRegistry: ReducerRegistry;

  export default ReducerRegistry;
}

declare module '@redhat-cloud-services/frontend-components-notifications/cjs/notifications' {
  export function notifications<T>(): ReducerHandler<T>;
  export default notifications;
}

declare module '@redhat-cloud-services/frontend-components-notifications/cjs/notificationsMiddleware' {
  export interface NotificationsMiddlewareOptions {
    dispatchDefaultFailure?: boolean;
    pendingSuffix?: string;
    fulfilledSuffix?: string;
    rejectedSuffix?: string;
    autoDismiss?: boolean;
    dismissDelay?: number;
    errorTitleKey?: string[];
    errorDescriptionKey?: string[];
    useStatusText?: false;
  }

  type NotificationMiddleware = (
    store: InternalAnyObject
  ) => (
    next: InternalDispatch<any>
  ) => (action: InternalAction) => InternalAction;
  export const createNotificationsMiddleware: (
    options: NotificationsMiddlewareOptions
  ) => NotificationMiddleware;

  export default createNotificationsMiddleware;
}
