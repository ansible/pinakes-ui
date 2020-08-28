import componentTypes from '@data-driven-forms/react-form-renderer/dist/cjs/component-types';
import loadOptions from './load-items-debounced';
import formMessages from '../messages/forms.messages';
import { BEFORE_TYPE } from '../utilities/constants';

const setItemsSelectSchema = (type, intl) => [
  {
    component: componentTypes.SELECT,
    name: `${type}_portfolio_item_id`,
    label: intl.formatMessage(
      type === BEFORE_TYPE
        ? formMessages.beforeProvision
        : formMessages.afterProvision
    ),
    loadOptions,
    noValueUpdates: true,
    isSearchable: true,
    isClearable: true
  }
];

export default setItemsSelectSchema;
