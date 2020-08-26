import componentTypes from '@data-driven-forms/react-form-renderer/dist/cjs/component-types';
import loadOptions from './load-items-debounced';
import formMessages from '../messages/forms.messages';

const resolveNewProcessProps = (type, props, _fieldApi, formOptions) => {
  const initialItems = formOptions.getState().values[`${type}-initial-items`];
  return {
    key: initialItems.length, // used to trigger options re-load and disable options update
    loadOptions: (...args) =>
      props.loadOptions(...args).then((data) =>
        data.map((option) => ({
          ...option,
          ...(initialItems.find(({ id }) => id === option.value) // we have to disable options that are already in the chip group
            ? { isDisabled: true }
            : {})
        }))
      )
  };
};

const setItemsSelectSchema = (type, intl) => ({
  fields: [
    {
      component: componentTypes.SELECT,
      name: `${type}-items`,
      label: '',
      loadOptions,
      multi: true,
      isSearchable: true,
      isClearable: true,
      resolveProps: resolveNewProcessProps
    },
    {
      component: 'initial-chips',
      name: 'initial-tags',
      label: intl.formatMessage(
        type === 'before'
          ? formMessages.setBeforeProducts
          : formMessages.setAfterProducts
      )
    }
  ]
});

export default setItemsSelectSchema;
