import * as ActionTypes from '../../Store/ActionTypes';

export const showModal = ({ modalProps, modalType }) => ({
  type: ActionTypes.SHOW_MODAL,
  payload: { modalProps, modalType }
});

export const hideModal = () => ({
  type: ActionTypes.HIDE_MODAL,
  payload: null
});

