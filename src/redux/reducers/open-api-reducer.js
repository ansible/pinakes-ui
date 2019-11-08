import { SET_OPENAPI_SCHEMA } from '../action-types';

export const openApiInitialState = {
  schema: undefined
};
const setSchema = (state, { payload }) => ({ ...state, schema: payload });

export default {
  [SET_OPENAPI_SCHEMA]: setSchema
};
