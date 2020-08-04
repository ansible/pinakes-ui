import componentTypes from '@data-driven-forms/react-form-renderer/dist/cjs/component-types';
import asyncFormValidator from '../utilities/async-form-validator';
import orderProcessesMessages from '../messages/order-processes.messages';

const resolveNewProcessProps = (props, _fieldApi, formOptions) => {
  const initialProcessess = formOptions.getState().values['initial-processes'];
  return {
    key: initialProcessess.length, // used to trigger options re-load and disable options update
    loadOptions: (...args) =>
      props.loadOptions(...args).then((data) =>
        data.map((option) => ({
          ...option,
          ...(initialProcessess.find(({ id }) => id === option.value) // we have to disable options that are already in the chip group
            ? { isDisabled: true }
            : {})
        }))
      )
  };
};

const createSchema = (formatMessage, loadProcesses) => ({
  fields: [
    {
      component: componentTypes.SELECT,
      name: 'new-processes',
      label: '',
      loadOptions: asyncFormValidator(loadProcesses),
      multi: true,
      isSearchable: true,
      isClearable: true,
      resolveProps: resolveNewProcessProps
    },
    {
      component: 'initial-chips',
      name: 'initial-processes',
      label: formatMessage(orderProcessesMessages.currentOrderProcesses)
    }
  ]
});

export default createSchema;
