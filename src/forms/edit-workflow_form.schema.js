import componentTypes from '@data-driven-forms/react-form-renderer/dist/cjs/component-types';
import asyncFormValidator from '../utilities/async-form-validator';

const resolveNewWorkflowProps = (props, _fieldApi, formOptions) => {
  const initialWorkflows = formOptions.getState().values['initial-workflows'];
  return {
    key: initialWorkflows.length, // used to trigger options re-load and disable options update
    loadOptions: (...args) =>
      props.loadOptions(...args).then((data) =>
        data.map((option) => ({
          ...option,
          ...(initialWorkflows.find(({ id }) => id === option.value) // we have to disable options that are already in the chip group
            ? { isDisabled: true }
            : {})
        }))
      )
  };
};

const editWorkflowSchema = (loadWorkflows) => ({
  fields: [
    {
      component: componentTypes.SELECT,
      name: 'new-workflows',
      label: '',
      loadOptions: asyncFormValidator(loadWorkflows),
      multi: true,
      isSearchable: true,
      isClearable: true,
      resolveProps: resolveNewWorkflowProps
    },
    {
      component: 'initial-chips',
      name: 'initial-workflows',
      label: 'Current approval processes'
    }
  ]
});

export default editWorkflowSchema;
