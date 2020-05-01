import { componentTypes } from '@data-driven-forms/react-form-renderer';
import { DEFAULT_MAX_LENGTH } from '../utilities/constants';

import asyncFormValidator from '../utilities/async-form-validator';
import { fetchPortfolioByName } from '../helpers/portfolio/portfolio-helper';

export const validateName = (name, portfolioId) =>
  fetchPortfolioByName(name)
    .then(({ data }) => {
      if (!name || name.trim().length === 0) {
        return 'Required';
      }

      return data.find(
        (portfolio) => portfolio.name === name && portfolio.id !== portfolioId
      )
        ? 'Name has already been taken'
        : undefined;
    })
    .catch((error) => error.data);

const debouncedValidator = asyncFormValidator(validateName);

/**
 * Creates a data-driven-form schema for adding/editing portfolio
 * @param {bool} newRecord sets the variant of portfolio form
 * @param openApiSchema
 * @param portfolioId
 */
export const createPortfolioSchema = (
  newRecord,
  openApiSchema,
  portfolioId
) => {
  console.log('DEBUG - openApiSchema: ', openApiSchema);

  return {
    fields: [
      {
        label: 'Name',
        name: 'name',
        component: componentTypes.TEXT_FIELD,
        isRequired: true,
        maxLength:
          openApiSchema?.components?.schemas?.Portfolio?.properties?.name
            ?.maxLength || DEFAULT_MAX_LENGTH,
        validate: [(value) => debouncedValidator(value, portfolioId)]
      },
      {
        label: 'Description',
        component: componentTypes.TEXTAREA,
        name: 'description'
      }
    ]
  };
};
