import componentTypes from '@data-driven-forms/react-form-renderer/dist/cjs/component-types';

import loadOptions from './load-items-debounced';
import formMessages from '../messages/forms.messages';

const setItemsSelectSchema = (type, intl) => ({
  component: componentTypes.SELECT,
  name: 'items',
  label: intl.formatMessage( type === 'before' ? formMessages.setBeforeProducts : formMessages.setAfterProducts),
  loadOptions,
  noValueUpdates: true,
  isMulti: true,
  isSearchable: true,
  simpleValue: false,
  menuIsPortal: true,
  isClearable: true,
  placeholder: intl.formatMessage(formMessages.selectProductPlaceholder)
});

export default setItemsSelectSchema;
