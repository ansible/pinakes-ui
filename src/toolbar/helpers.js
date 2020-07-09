import { toolbarComponentTypes } from './toolbar-mapper';

export const createLinkButton = ({ pathname, preserveSearch, ...item }) => ({
  component: toolbarComponentTypes.TOOLBAR_ITEM,
  key: `${item.key}/button-link`,
  fields: [
    {
      component: toolbarComponentTypes.LINK,
      pathname,
      preserveSearch,
      key: `${item.key}/button-link`,
      isDisabled: item.isDisabled,
      fields: [
        {
          component: toolbarComponentTypes.BUTTON,
          ...item
        }
      ]
    }
  ]
});
