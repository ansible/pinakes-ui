import { TOGGLE_EDIT_SERVICE_PORTAL_ITEM } from '../ActionTypes/UiActionTypes';
import ReducerRegistry from '../../Utilities/ReducerRegistry';
import UiReducer from '../Reducers/UiReducer';

ReducerRegistry.register({ UiReducer });

export const toggleEdit = () => ({
  type: TOGGLE_EDIT_SERVICE_PORTAL_ITEM
});
