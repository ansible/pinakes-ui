import { I18nFormatMessage } from '../redux/reducers/i18n-reducer';
import { CatalogRootState } from '../types/redux';

const extractFormatMessage = (
  getState: () => CatalogRootState
): I18nFormatMessage => getState().i18nReducer.formatMessage!;

export default extractFormatMessage;
