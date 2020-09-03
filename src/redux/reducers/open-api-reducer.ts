import { SET_OPENAPI_SCHEMA } from '../action-types';
import { AnyObject, ReduxActionHandler } from '../../types/common-types';

export interface OpenApiReducerState extends AnyObject {
  schema?: AnyObject;
}
export type OpenApiReducerActionHandler = ReduxActionHandler<
  OpenApiReducerState
>;

export const openApiInitialState: OpenApiReducerState = {
  schema: undefined
};
const setSchema: OpenApiReducerActionHandler = (state, { payload }) => ({
  ...state,
  schema: payload
});

export default {
  [SET_OPENAPI_SCHEMA]: setSchema
};
