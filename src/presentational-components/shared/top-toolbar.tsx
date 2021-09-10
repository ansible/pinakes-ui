/* eslint-disable react/prop-types */
import React, { Fragment, ReactNode, useContext } from 'react';
import {
  LevelItem,
  Text,
  TextContent,
  TextVariants
} from '@patternfly/react-core';
import clsx from 'clsx';
import { ToolbarTitlePlaceholder } from './loader-placeholders';
import CatalogBreadcrumbs from '../../smart-components/common/catalog-breadcrumbs';
import {
  TopToolbarWrapper,
  TopToolbarTitleContainer
} from '../styled-components/toolbars';
import { BreadcrumbFragment } from '../../redux/reducers/breadcrumbs-reducer';
import { PageHeaderTitle } from '@redhat-cloud-services/frontend-components/PageHeader';
import UserContext from '../../user-context';
import '../../Navigation.scss';

export interface TopToolbarProps {
  paddingBottom?: boolean;
  breadcrumbs?: boolean;
  breadcrumbfragments?: BreadcrumbFragment[];
}
const TopToolbar: React.ComponentType<TopToolbarProps> = ({
  children,
  paddingBottom = true,
  breadcrumbs = true,
  breadcrumbfragments = [],
  ...rest
}) => {
  const { standalone: standalone } = useContext(UserContext);
  return (
    <div className="standalone-toolbar">
      <TopToolbarWrapper
        className={`pf-u-pt-lg pf-u-pr-lg pf-u-pl-lg ${
          paddingBottom ? 'pf-u-pb-lg' : ''
        }`}
        {...rest}
      >
        {breadcrumbs && (
          <div className="pf-u-mb-md">
            {' '}
            <CatalogBreadcrumbs breadcrumbfragments={breadcrumbfragments} />
          </div>
        )}
        {children}
      </TopToolbarWrapper>
    </div>
  );
};

export default TopToolbar;

export interface TopToolbarTitleProps {
  title?: React.ElementType;
  description?: ReactNode;
  noData?: boolean;
}
export const TopToolbarTitle: React.ComponentType<TopToolbarTitleProps> = ({
  title = <ToolbarTitlePlaceholder />,
  description,
  children,
  noData,
  ...rest
}) => (
  <Fragment>
    <TopToolbarTitleContainer
      className={clsx({ 'pf-u-mb-lg': !noData, 'flex-no-wrap': true })}
      {...rest}
    >
      <LevelItem>
        <TextContent>
          <PageHeaderTitle title={title} className="pf-u-m-0 pf-u-mr-md" />
          {description && <Text component={TextVariants.p}>{description}</Text>}
        </TextContent>
      </LevelItem>
      <LevelItem className="flex-item-no-wrap">{children}</LevelItem>
    </TopToolbarTitleContainer>
  </Fragment>
);
