import Field from '@data-driven-forms/react-form-renderer/dist/cjs/field';
import Schema from '@data-driven-forms/react-form-renderer/dist/cjs/schema';
import { SelectOptions } from '../types/common-types';

/**
 * Creates a data-driven-form schema for sharing/un-sharing portfolio
 */
const newShareSchema = (
  loadGroupOptions: (inputValue?: string) => Promise<SelectOptions>,
  permissionVerbs: SelectOptions
): Field[] => [
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

const groupShareSchema = (permissionVerbs: SelectOptions): Field[] => [
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
  loadGroupOptions: (inputValue?: string) => Promise<SelectOptions>,
  permissionVerbs: SelectOptions,
  canShare: boolean,
  canUnshare: boolean
): Schema => {
  const portfolioSchema = {
    fields: [
      ...(canShare ? newShareSchema(loadGroupOptions, permissionVerbs) : []),
      ...(canUnshare ? groupShareSchema(permissionVerbs) : [])
    ]
  };
  return portfolioSchema;
};
