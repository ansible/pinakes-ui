import { componentTypes, validatorTypes } from '@data-driven-forms/react-form-renderer';

/**
 * Creates a data-driven-form schema for adding/editing portfolio
 * @param {bool} newRecord sets the variant of portfolio form
 * @param {Array} workflows array of options for workflows
 */
export const createPortfolioSchema = (newRecord, workflows) => ({
  fields: [{
    label: newRecord ? 'New Portfolio Name' : 'Portfolio Name',
    name: 'name',
    component: componentTypes.TEXT_FIELD,
    isRequired: true,
    validate: [{
      type: validatorTypes.REQUIRED
    }]
  }, {
    label: 'Description',
    component: componentTypes.TEXTAREA,
    name: 'description'
  }, {
    label: 'Approval workflow',
    name: 'workflow_ref',
    component: componentTypes.SELECT,
    options: workflows
  }]
});
