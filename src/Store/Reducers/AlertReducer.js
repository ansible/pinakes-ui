import { ADD_ALERT, REMOVE_ALERT } from '../ActionTypes/AlertActionTypes';

const initialState = {
  alerts: []
};

const alertReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_ALERT: {
      return { ...state, alerts: [ ...state.alerts, action.payload ]};
    }

    case REMOVE_ALERT: {
      return { ...state, alerts: [ ...state.alerts.slice(0, action.payload), ...state.alerts.slice(action.payload + 1) ]};
    }
  }

  return state;
};

export default alertReducer;
