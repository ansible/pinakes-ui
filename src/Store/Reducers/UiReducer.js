import { TOGGLE_EDIT_SERVICE_PORTAL_ITEM } from '../ActionTypes/UiActionTypes';

const initialState = {
  isEditing: false
};

const uiReducer = (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_EDIT_SERVICE_PORTAL_ITEM: {
      return { ...state, isEditing: !state.isEditing };
    }
  }

  return state;
};

export default uiReducer;
