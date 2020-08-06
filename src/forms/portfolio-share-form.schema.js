/**
 * Creates a data-driven-form schema for sharing/un-sharing portfolio
 */
const newShareSchema = (loadGroupOptions, permissionVerbs) => [
  {
    component: 'sub-form',
    description: 'share.new.description',
    name: 'new_share',
    key: '1',
    fields: [
      {
        name: 'group-selection',
        component: 'share-group-select',
        loadOptions: loadGroupOptions,
        isSearchable: true,
        permissions: permissionVerbs
      }
    ]
  }
];

const groupShareSchema = (permissionVerbs) => [
  {
    component: 'sub-form',
    name: 'current-groups-sub-form',
    fields: [
      {
        name: 'shared-groups',
        permissionVerbs,
        component: 'share-group-edit'
      }
    ]
  }
];

export const createPortfolioShareSchema = (
  loadGroupOptions,
  permissionVerbs,
  canShare,
  canUnshare,
  validate
) => {
  const portfolioSchema = {
    fields: [
      ...(canShare
        ? newShareSchema(loadGroupOptions, permissionVerbs, validate)
        : []),
      ...(canUnshare ? groupShareSchema(permissionVerbs) : [])
    ]
  };
  return portfolioSchema;
};
