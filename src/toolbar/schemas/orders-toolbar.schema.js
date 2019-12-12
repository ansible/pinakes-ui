import React from 'react';
import { useLocation } from 'react-router-dom';
import { toolbarComponentTypes } from '../toolbar-mapper';
import { Breadcrumb, BreadcrumbItem } from '@patternfly/react-core';
import { NavLink } from 'react-router-dom';

const fragmentOverride = {
  orders: 'Orders',
  approval: 'Approval'
};

const OrdersBreadcrumbs = () => {
  const location = useLocation();
  const partials = [...location.pathname.split('/')];
  const fragments = location.pathname
    .split('/')
    .map((fragment, index) => ({
      path: partials.slice(0, index + 1).join('/'),
      title: fragmentOverride[fragment] || fragment
    }))
    .filter(({ path }) => path !== '');

  if (fragments.length <= 1) {
    return null;
  }

  return (
    <Breadcrumb className="orders bg-fill pf-u-pt-md pf-u-pl-xl pf-u-pr-xl">
      {fragments.map(({ path, title }, index) => (
        <BreadcrumbItem key={path} isActive={index === fragments.length - 1}>
          <NavLink
            exact
            to={{
              search: path !== '/orders' && location.search,
              pathname: path
            }}
            isActive={() => index === fragments.length - 1}
            activeClassName="breadcrumb-active"
          >
            {title}
          </NavLink>
        </BreadcrumbItem>
      ))}
    </Breadcrumb>
  );
};

const createOrdersToolbarSchema = () => ({
  fields: [
    {
      component: OrdersBreadcrumbs,
      key: 'foo-breadcrumbs'
    },
    {
      component: toolbarComponentTypes.TOP_TOOLBAR,
      className: 'orders bg-fill pf-u-pt-md pf-u-pl-xl pf-u-pr-xl',
      key: 'orders-toolbar',
      breadcrumbs: false,
      fields: [
        {
          component: toolbarComponentTypes.TOP_TOOLBAR_TITLE,
          key: 'orders-toolbar-title',
          title: 'Orders',
          className: ''
        }
      ]
    }
  ]
});

export default createOrdersToolbarSchema;
