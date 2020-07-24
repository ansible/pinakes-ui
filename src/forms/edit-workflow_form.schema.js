import componentTypes from '@data-driven-forms/react-form-renderer/dist/cjs/component-types';
import asyncFormValidator from '../utilities/async-form-validator';

const editWorkflowSchema = (loadWorkflows) => ({
  fields: [
    {
      component: componentTypes.SELECT,
      name: 'selectedWorkflows',
      label: '',
      loadOptions: asyncFormValidator(loadWorkflows),
      multi: true,
      isSearchable: true,
      isClearable: true
    },
    {
      component: 'initial-chips',
      name: 'selected-workflows-spy'
    }
  ]
});

export default editWorkflowSchema;
