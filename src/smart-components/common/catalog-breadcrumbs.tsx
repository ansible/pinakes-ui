import React from 'react';
import { Breadcrumb, BreadcrumbItem } from '@patternfly/react-core';
import { useSelector } from 'react-redux';
import ConditionalLink from '../../presentational-components/shared/conditional-link';
import { BreadcrumbFragment } from '../../redux/reducers/breadcrumbs-reducer';
import { CatalogRootState } from '../../types/redux';

const CatalogBreadcrumbs = ({ breadcrumbfragments = [] }) => {
  console.log(
    'Debug - CatalogBreadcrumbs - breadcrumbfragments: ',
    breadcrumbfragments
  );
  const fragments = breadcrumbfragments?.length
    ? breadcrumbfragments
    : useSelector<CatalogRootState, BreadcrumbFragment[]>(
        ({ breadcrumbsReducer: { fragments } }) => fragments
      );

  if (fragments.length <= 1) {
    return null;
  }

  return (
    <Breadcrumb>
      {fragments.map(({ title, pathname, searchParams }, index) => (
        <ConditionalLink
          pathname={!(fragments.length === index + 1) ? pathname : undefined}
          searchParams={searchParams}
          nav
          exact
          key={pathname}
          className="pf-c-breadcrumb__item"
        >
          <BreadcrumbItem
            showDivider={index > 0}
            isActive={fragments.length === index + 1}
          >
            {title}
          </BreadcrumbItem>
        </ConditionalLink>
      ))}
    </Breadcrumb>
  );
};

export default CatalogBreadcrumbs;
