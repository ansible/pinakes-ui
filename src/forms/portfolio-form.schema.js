import { componentTypes } from '@data-driven-forms/react-form-renderer';

import asyncFormValidator from '../utilities/async-form-validator';
import { fetchPortfolioByName } from '../helpers/portfolio/portfolio-helper';

const validateName = (name, portfolioId) => fetchPortfolioByName(name)
.then(({ data }) => {
  if (!name || name.trim().length === 0) {
    return 'Required';
  }

  return data.find(portfolio => portfolio.name === name && portfolio.id !== portfolioId)
    ? 'Name has already been taken'
    : undefined;
});

const debouncedValidator = asyncFormValidator(validateName);

/**
 * Creates a data-driven-form schema for adding/editing portfolio
 * @param {bool} newRecord sets the variant of portfolio form
 * @param {Array} workflows array of options for workflows
 */
export const createPortfolioSchema = (newRecord, workflows, portfolioId) => ({
  fields: [{
    label: newRecord ? 'New Portfolio Name' : 'Portfolio Name',
    name: 'name',
    component: componentTypes.TEXT_FIELD,
    isRequired: true,
    validate: [ value => debouncedValidator(value, portfolioId) ]
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
