import { INITIALIZE_I18N } from '../action-types';

export const i18nInitialState = {
  formatMessage: ({ defaultMessage = '' }) => defaultMessage
};
const initialize = (state, { payload }) => ({ ...state, ...payload });

export default {
  [INITIALIZE_I18N]: initialize
};
