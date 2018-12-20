import { SHOW_MODAL, HIDE_MODAL } from '../../redux/ActionTypes';

export const mainModalInitialState = {
  modalType: null,
  modalProps: {}
};

const showModal = (state, { payload: { modalProps, modalType }, type }) => ({
  ...state,
  modalProps,
  modalType,
  type
});

const hideModal = () => ({
  ...mainModalInitialState
});

export default {
  [SHOW_MODAL]: showModal,
  [HIDE_MODAL]: hideModal
};
