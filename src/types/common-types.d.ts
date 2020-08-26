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
