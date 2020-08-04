import componentTypes from '@data-driven-forms/react-form-renderer/dist/cjs/component-types';
import asyncFormValidator from '../utilities/async-form-validator';

const createSchema = (intl, loadProcesses) => ({
  fields: [
    {
      component: componentTypes.SELECT,
      name: 'new-processes',
      label: '',
      loadOptions: asyncFormValidator(loadProcesses),
      multi: true,
      isSearchable: true,
      isClearable: true
      // resolveProps: resolveNewWorkflowProps
    },
    {
      component: 'initial-chips',
      name: 'initial-processes',
      label: 'Current order processes'
    }
  ]
});

export default createSchema;
