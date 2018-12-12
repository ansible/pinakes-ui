import * as ActionTypes from '../../Store/ActionTypes';

const initialState = {
  modalType: null,
  modalProps: {}
};

const MainModalReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.SHOW_MODAL:
      return {
        ...state,
        modalProps: action.payload.modalProps,
        modalType: action.payload.modalType,
        type: action.type
      };
    case ActionTypes.HIDE_MODAL:
      return initialState;
    default:
      return state;
  }
};

export default MainModalReducer;
