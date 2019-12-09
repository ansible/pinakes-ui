/**
 * Creates a data-driven-form schema for sharing/un-sharing portfolio
 */
const newShareSchema = (rbacGroups, loadGroupOptions, permissionVerbs) => (
  { fields: [
    {
      component: 'sub-form',
      description: 'Invite group',
      name: 'new_share',
      key: '1',
      fields: [{
        name: 'group-selection',
        component: 'share-group-select',
        inputName: 'group_uuid',
        selectName: 'permissions',
        groups: rbacGroups,
        loadOptions: loadGroupOptions,
        isSearchable: true,
        permissions: permissionVerbs
      }]
    }
  ]
  }
);

const groupListSchema = (groupFieldList) => (
  {
    fields: [
      {
        component: 'sub-form',
        description: 'Groups with access',
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
      component: 'share-group-edit',
      options: permissionVerbs,
      isClearable: true
    }]
  }
);

export const createPortfolioShareSchema = (shareItems, loadGroupOptions, permissionVerbs) => {
  const shareInfo = shareItems.items;
  const rbacGroups = shareItems.groups;
  const formSchema = newShareSchema(rbacGroups, loadGroupOptions, permissionVerbs);
  const groupInfoFields = shareInfo.map((group) => (groupShareSchema(group, permissionVerbs)));
  const shareListSchema =  { ...groupListSchema([ ...groupInfoFields ]) };
  const portfolioSchema =  { fields: [ ...formSchema.fields, ...shareListSchema.fields ]};
  return portfolioSchema;
};
