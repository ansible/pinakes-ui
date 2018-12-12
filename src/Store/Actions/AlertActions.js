import { ADD_ALERT, REMOVE_ALERT } from '../ActionTypes/AlertActionTypes';

/**
* @param alert Data object
* @param alert.variant type of alert message
* @param alert.title title of alert message
* @param alert.description description of alert message
*/
export const addAlert = alert => ({
  type: ADD_ALERT,
  payload: alert
});

/**
* @param index index of alert
*/
export const removeAlert = index => ({
  type: REMOVE_ALERT,
  payload: index
});
