import { ADD_ALERT, REMOVE_ALERT } from '../ActionTypes/AlertActionTypes';

export const alertsInitialState = {
  alerts: []
};

export default {
  [ADD_ALERT]: (state, { payload }) => ({ ...state, alerts: [ ...state.alerts, payload ]}),
  [REMOVE_ALERT]: (state, { payload }) => ({ ...state, alerts: [ ...state.alerts.slice(0, payload), ...state.alerts.slice(payload + 1) ]})
};
