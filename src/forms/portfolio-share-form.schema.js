import { componentTypes, validatorTypes } from '@data-driven-forms/react-form-renderer';

/**
 * Creates a data-driven-form schema for sharing/un-sharing portfolio
 */
export const createPortfolioShareSchema = (rbacGroups, permissionVerbs) => (
    { fields: [
        {
          component: "sub-form",
          title: "Invite Group",
          description: "New share",
          name: "new_share",
          key: "1",
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
          }
          ],
        },{
          component: "sub-form",
          title: "Groups With Access",
          description: "Groups with access",
          name: "shares",
          key: "2",
          fields: [
            {
              component: "fields-array",
              description: "Group",
              name: "group",
              key: "3",
              fields: [{
                name: 'group name',
                component: componentTypes.TEXT_FIELD,
                value: 'Name1'
              }, {
                label: 'Permissions',
                name: 'permissions',
                isRequired: true,
                component: componentTypes.SELECT,
                options: permissionVerbs
              }]
            },
              {
            label: ' ',
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
        }
      ]
    }
);
