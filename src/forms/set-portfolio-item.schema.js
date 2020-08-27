import componentTypes from '@data-driven-forms/react-form-renderer/dist/cjs/component-types';
import loadOptions from './load-items-debounced';
import formMessages from '../messages/forms.messages';

const setItemsSelectSchema = (type, intl) => [
  {
    component: componentTypes.SELECT,
    name: `${type}_portfolio_item_id`,
    label: intl.formatMessage(
      type === 'before'
        ? formMessages.beforeProvision
        : formMessages.afterProvision
    ),
    loadOptions,
    isSearchable: true,
    isClearable: true
  }
];

export default setItemsSelectSchema;
