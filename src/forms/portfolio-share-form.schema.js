import { componentTypes, validatorTypes } from '@data-driven-forms/react-form-renderer';

/**
 * Creates a data-driven-form schema for sharing/un-sharing portfolio
 */
export const createPortfolioShareSchema = (rbacGroups, permissionVerbs) => ({
  fields: [{
    label: 'Invite Group',
    name: 'group',
    component: componentTypes.SELECT,
    options: rbacGroups
  }, {
    label: 'Permissions',
    name: 'permissions',
    isRequired: true,
    component: componentTypes.SELECT,
    options: permissionVerbs
  }]
});
