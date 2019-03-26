import { componentTypes, validatorTypes } from '@data-driven-forms/react-form-renderer';

/**
 * Creates a data-driven-form schema for sharing/un-sharing portfolio
 */
const newShareSchema = ( rbacGroups, permissionVerbs ) => (
    { fields: [
        {
          component: "sub-form",
          title: "Invite Group",
          name: "new_share",
          key: "1",
          fields: [{
            name: 'group',
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
    component: "sub-form",
    title: "Groups With Access",
    name: "share_list",
    key: "share_list",
    fields: [...groupFieldList]
  }
]
}

);

const groupShareSchema = ( groupShareInfo, permissionVerbs ) => (
  {
    component: "sub-form",
    name: `${groupShareInfo.group_name}`,
    key: `${groupShareInfo.group_uuid}`,
    fields: [{
      name: `${groupShareInfo.group_name}`,
      label: `${groupShareInfo.group_name}`,
      isRequired: true,
      component: componentTypes.SELECT,
      options: permissionVerbs
    }]
  }
);

export const createPortfolioShareSchema = ( shareInfo, rbacGroups, permissionVerbs) => {
  let formSchema = newShareSchema(rbacGroups, permissionVerbs);
  let groupInfoFields = shareInfo.map((group) =>( groupShareSchema(group, permissionVerbs)));
  console.log('permissionVerbs', permissionVerbs);
  console.log('groupInfoFields', groupInfoFields);
  console.log('formSchema', formSchema);
  let shareListSchema =  {...groupListSchema([...groupInfoFields])};
  console.log('shareListSchema', shareListSchema);
  let portfolioSchema =  {fields: [...formSchema.fields, ...shareListSchema.fields] };
  console.log('portfolioSchema', portfolioSchema);
  return portfolioSchema;
};
