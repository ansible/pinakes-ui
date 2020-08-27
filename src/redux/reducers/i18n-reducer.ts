import { IntlShape } from 'react-intl';
import { INITIALIZE_I18N } from '../action-types';
import { AnyObject, ReduxAction } from '../../types/common-types';
import { StateFromReducersMapObject } from 'redux';

export type I18nReducerState = Partial<IntlShape> & AnyObject;
export type I18nReducerActionHandler = (
  state: StateFromReducersMapObject<I18nReducerState>,
  action: ReduxAction
) => I18nReducerState;

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
