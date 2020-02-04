import { toolbarComponentTypes } from './toolbar-mapper';

export const createSingleItemGroup = ({
  groupName,
  hidden = false,
  ...item
}) => ({
  component: toolbarComponentTypes.TOOLBAR_GROUP,
  key: `${groupName}/single-toolbar-item-group`,
  fields: hidden
    ? []
    : [
        {
          component: toolbarComponentTypes.TOOLBAR_ITEM,
          key: `${groupName}/single-toolbar-item`,
          fields: [item]
        }
      ]
});

export const createLinkButton = ({ pathname, preserveSearch, ...item }) => ({
  component: toolbarComponentTypes.LINK,
  pathname,
  preserveSearch,
  key: `${item.key}/button-link`,
  className: item.isDisabled ? 'disabled-link' : '',
  fields: [
    {
      component: toolbarComponentTypes.BUTTON,
      ...item
    }
  ]
});
