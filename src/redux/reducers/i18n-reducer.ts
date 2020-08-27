import { IntlShape } from 'react-intl';
import { INITIALIZE_I18N } from '../action-types';
import { AnyObject, ReduxActionHandler } from '../../types/common-types';

export type I18nReducerState = Partial<IntlShape> & AnyObject;
export type I18nReducerActionHandler = ReduxActionHandler<I18nReducerState>;

export const i18nInitialState: I18nReducerState = {
  formatMessage: ({ defaultMessage = '' }) => defaultMessage
};
const initialize: I18nReducerActionHandler = (state, { payload }) => ({
  ...state,
  ...payload
});

export default {
  [INITIALIZE_I18N]: initialize
};
