import { componentTypes } from '@data-driven-forms/react-form-renderer';
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
    }
  ]
});

export default editWorkflowSchema;
