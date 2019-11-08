import { componentTypes } from '@data-driven-forms/react-form-renderer';
import asyncFormValidator from '../utilities/async-form-validator';

const editWorkflowSchema = (loadWorkflows) => ({
  fields: [{
    component: componentTypes.SELECT,
    name: 'workflow',
    label: 'Approval workflow',
    loadOptions: asyncFormValidator(loadWorkflows),
    isSearchable: true,
    isClearable: true
  }]
});

export default editWorkflowSchema;
