import { toolbarComponentTypes } from './toolbar-mapper';

export const createLinkButton = ({
  pathname,
  preserveSearch,
  id,
  ...item
}) => ({
  component: toolbarComponentTypes.TOOLBAR_ITEM,
  key: `${item.key}/button-link`,
  fields: [
    {
      component: toolbarComponentTypes.LINK,
      pathname,
      preserveSearch,
      key: `${item.key}/button-link`,
      isDisabled: item.isDisabled,
      id,
      fields: [
        {
          component: toolbarComponentTypes.BUTTON,
          ...item
        }
      ]
    }
  ]
});
