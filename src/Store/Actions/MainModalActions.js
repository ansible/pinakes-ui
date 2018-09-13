import * as ActionTypes from 'Store/ActionTypes';
import ReducerRegistry from 'Utilities/ReducerRegistry';
import { MainModalReducer } from 'Store/Reducers/MainModalStore';

ReducerRegistry.register({ MainModalStore: MainModalReducer });

export const showModal = ({ modalProps, modalType }) => ( {
    type: ActionTypes.SHOW_MODAL,
    payload: {modalProps, modalType}
});

export const hideModal = () => ( {
  type: ActionTypes.HIDE_MODAL,
  payload: null
});

