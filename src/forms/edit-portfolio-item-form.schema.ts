import Schema from '@data-driven-forms/react-form-renderer/common-types/schema';
import componentTypes from '@data-driven-forms/react-form-renderer/component-types';
import validatorTypes from '@data-driven-forms/react-form-renderer/validator-types';

export const editPortfolioItemSchema: Schema = {
  fields: [
    {
      component: componentTypes.TEXT_FIELD,
      name: 'name',
      label: 'schemas.portfolio-item.name',
      isRequired: true,
      validate: [{ type: validatorTypes.REQUIRED }]
    },
    {
      component: componentTypes.TEXT_FIELD,
      name: 'description',
      label: 'schemas.portfolio-item.description'
    },
    {
      component: componentTypes.TEXT_FIELD,
      name: 'long_description',
      label: 'schemas.portfolio-item.long_description'
    },
    {
      component: componentTypes.TEXT_FIELD,
      name: 'distributor',
      label: 'schemas.portfolio-item.vendor'
    },
    {
      component: componentTypes.TEXT_FIELD,
      name: 'documentation_url',
      label: 'schemas.portfolio-item.documentation_url',
      validate: [
        {
          type: validatorTypes.URL
        }
      ]
    },
    {
      component: componentTypes.TEXT_FIELD,
      name: 'support_url',
      label: 'schemas.portfolio-item.support_url',
      validate: [
        {
          type: validatorTypes.URL
        }
      ]
    }
  ]
};

export const editPortfolioItemSchemaS: Schema = {
  fields: [
    {
      component: componentTypes.TEXT_FIELD,
      name: 'name',
      label: 'schemas.portfolio-item.name',
      isRequired: true,
      validate: [{ type: validatorTypes.REQUIRED }]
    },
    {
      component: componentTypes.TEXT_FIELD,
      name: 'description',
      label: 'schemas.portfolio-item.description'
    }
  ]
};
