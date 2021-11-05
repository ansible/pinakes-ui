import { IntlShape, MessageDescriptor } from 'react-intl';
import { INITIALIZE_I18N } from '../action-types';
import { AnyObject, ReduxActionHandler } from '../../types/common-types';
import { ReactNode } from 'react';

export type I18nReducerState = Partial<IntlShape> & AnyObject;
export type I18nReducerActionHandler = ReduxActionHandler<I18nReducerState>;
export type I18nFormatMessage = (
  descriptor: MessageDescriptor,
  values?: AnyObject
) => ReactNode;

export const i18nInitialState: I18nReducerState = {
  // @ts-ignore
  formatMessage: ({ defaultMessage = '' }) => defaultMessage
};
const initialize: I18nReducerActionHandler = (state, { payload }) => ({
  ...state,
  ...payload
});

export default {
  [INITIALIZE_I18N]: initialize
};
