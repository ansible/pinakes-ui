import { TOGGLE_EDIT_SERVICE_PORTAL_ITEM } from '../ActionTypes/UiActionTypes';

export const uiInitialState = {
  isEditing: false
};

const toggleEdit = state => ({ ...state, isEditing: !state.isEditing });

export default {
  [TOGGLE_EDIT_SERVICE_PORTAL_ITEM]: toggleEdit
};
