import { I18nFormatMessage } from '../redux/reducers/i18n-reducer';
import { GetReduxState } from '../types/redux';

const extractFormatMessage = (getState: GetReduxState): I18nFormatMessage =>
  getState().i18nReducer.formatMessage!;

export default extractFormatMessage;
