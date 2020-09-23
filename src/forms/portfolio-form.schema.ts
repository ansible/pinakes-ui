import componentTypes from '@data-driven-forms/react-form-renderer/dist/cjs/component-types';
import Schema from '@data-driven-forms/react-form-renderer/dist/cjs/schema';
import { DEFAULT_MAX_LENGTH } from '../utilities/constants';

import asyncFormValidator from '../utilities/async-form-validator';
import { fetchPortfolioByName } from '../helpers/portfolio/portfolio-helper';
import { AnyObject } from '../types/common-types';

export const validateName = (
  name: string,
  portfolioId: string
): Promise<void> =>
  fetchPortfolioByName(name).then(({ data }) => {
    if (!name || name.trim().length === 0) {
      throw 'Required';
    }

    const conflict = data.find(
      (portfolio) => portfolio.name === name && portfolio.id !== portfolioId
    );
    if (conflict) {
      throw 'Name has already been taken';
    }
  });

const debouncedValidator = asyncFormValidator(validateName);

/**
 * Creates a data-driven-form schema for adding/editing portfolio
 * @param {bool} newRecord sets the variant of portfolio form
 * @param openApiSchema
 * @param portfolioId
 */
export const createPortfolioSchema = (
  openApiSchema: AnyObject,
  portfolioId: string
): Schema => ({
  fields: [
    {
      label: 'schemas.portfolio.name',
      name: 'name',
      component: componentTypes.TEXT_FIELD,
      isRequired: true,
      maxLength:
        openApiSchema?.components?.schemas?.Portfolio?.properties?.name
          ?.maxLength || DEFAULT_MAX_LENGTH,
      validate: [(value: string) => debouncedValidator(value, portfolioId)]
    },
    {
      label: 'schemas.portfolio.description',
      component: componentTypes.TEXTAREA,
      name: 'description'
    }
  ]
});
