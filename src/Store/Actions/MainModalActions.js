import * as ActionTypes from '../../Store/ActionTypes';
import { MainModalReducer } from '../../Store/Reducers/MainModalStore';
import ReducerRegistry from '../../Utilities/ReducerRegistry';

ReducerRegistry.register({ MainModalStore: MainModalReducer });

export const showModal = ({ modalProps, modalType }) => ({
  type: ActionTypes.SHOW_MODAL,
  payload: { modalProps, modalType }
});

export const hideModal = () => ({
  type: ActionTypes.HIDE_MODAL,
  payload: null
});

