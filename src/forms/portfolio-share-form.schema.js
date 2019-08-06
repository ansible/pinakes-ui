import { componentTypes } from '@data-driven-forms/react-form-renderer';

/**
 * Creates a data-driven-form schema for sharing/un-sharing portfolio
 */
const newShareSchema = (rbacGroups, permissionVerbs) => (
  { fields: [
    {
      component: 'sub-form',
      title: 'Invite group',
      name: 'new_share',
      key: '1',
      fields: [{
        name: 'group_uuid',
        component: componentTypes.SELECT,
        options: rbacGroups
      }, {
        name: 'permissions',
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
        title: 'Groups with access',
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
      component: componentTypes.SELECT,
      options: permissionVerbs
    }]
  }
);

export const createPortfolioShareSchema = (shareItems, permissionVerbs) => {
  const shareInfo = shareItems.items;
  const rbacGroups = shareItems.groups;
  const formSchema = newShareSchema(rbacGroups, permissionVerbs);
  const groupInfoFields = shareInfo.map((group) => (groupShareSchema(group, permissionVerbs)));
  const shareListSchema =  { ...groupListSchema([ ...groupInfoFields ]) };
  const portfolioSchema =  { fields: [ ...formSchema.fields, ...shareListSchema.fields ]};
  return portfolioSchema;
};
