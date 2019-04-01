import { componentTypes } from '@data-driven-forms/react-form-renderer';

/**
 * Creates a data-driven-form schema for sharing/un-sharing portfolio
 */
const newShareSchema = (rbacGroups, permissionVerbs) => (
  { fields: [
    {
      component: 'sub-form',
      title: 'Invite Group',
      name: 'new_share',
      key: '1',
      fields: [{
        name: 'group_uuid',
        component: componentTypes.SELECT,
        options: rbacGroups
      }, {
        name: 'permissions',
        isRequired: true,
        component: componentTypes.SELECT,
        options: permissionVerbs
      }
      ]
    }
  ]
  }
);

const groupListSchema = (groupFieldList) => (
  {
    fields: [
      {
        component: 'sub-form',
        title: 'Groups With Access',
        name: 'share_list',
        key: 'share_list',
        fields: [ ...groupFieldList ]
      }
    ]
  }

);

const groupShareSchema = (groupShareInfo, permissionVerbs) => (
  {
    component: 'sub-form',
    name: `${groupShareInfo.group_name}`,
    key: `${groupShareInfo.group_name}`,
    fields: [{
      name: `${groupShareInfo.group_name}`,
      label: `${groupShareInfo.group_name}`,
      isRequired: false,
      component: componentTypes.SELECT,
      options: [ ...permissionVerbs, { value: '', label: 'None' }]
    }]
  }
);

export const createPortfolioShareSchema = (shareItems, permissionVerbs) => {
  let shareInfo = shareItems.items;
  let rbacGroups = shareItems.groups;
  let formSchema = newShareSchema(rbacGroups, permissionVerbs);
  let groupInfoFields = shareInfo.map((group) =>(groupShareSchema(group, permissionVerbs)));
  let shareListSchema =  { ...groupListSchema([ ...groupInfoFields ]) };
  let portfolioSchema =  { fields: [ ...formSchema.fields, ...shareListSchema.fields ]};
  return portfolioSchema;
};
