import { componentTypes, validatorTypes } from '@data-driven-forms/react-form-renderer';

const editPortfolioItemSchema = workflows => ({
  fields: [{
    component: componentTypes.TEXT_FIELD,
    name: 'display_name',
    label: 'Display name'
  }, {
    component: componentTypes.TEXT_FIELD,
    name: 'description',
    label: 'Description'
  }, {
    component: componentTypes.TEXT_FIELD,
    name: 'long_description',
    label: 'Long description'
  }, {
    component: componentTypes.TEXT_FIELD,
    name: 'distributor',
    label: 'Vendor'
  }, {
    component: componentTypes.TEXT_FIELD,
    name: 'documentation_url',
    label: 'Documentation URL',
    validate: [{
      type: validatorTypes.URL
    }]
  }, {
    component: componentTypes.TEXT_FIELD,
    name: 'support_url',
    label: 'Support URL',
    validate: [{
      type: validatorTypes.URL
    }]
  }, {
    component: componentTypes.SELECT,
    name: 'workflow_ref',
    label: 'Approval workflow',
    options: workflows
  }]
});

export default editPortfolioItemSchema;
