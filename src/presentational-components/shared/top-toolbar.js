import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
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

const TopToolbar = ({
  children,
  paddingBottom,
  breadcrumbs,
  breadcrumbsSpacing,
  ...rest
}) => (
  <TopToolbarWrapper
    className={`pf-u-pt-lg pf-u-pr-lg pf-u-pl-lg ${
      paddingBottom ? 'pf-u-pb-lg' : ''
    }`}
    {...rest}
  >
    {breadcrumbs && (
      <div className="pf-u-mb-md">
        {' '}
        <CatalogBreadcrumbs />
      </div>
    )}
    {children}
  </TopToolbarWrapper>
);

TopToolbar.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired,
  paddingBottom: PropTypes.bool,
  breadcrumbs: PropTypes.bool,
  breadcrumbsSpacing: PropTypes.bool
};

TopToolbar.defaultProps = {
  paddingBottom: true,
  breadcrumbs: true
};

export default TopToolbar;

export const TopToolbarTitle = ({
  title,
  description,
  children,
  noData,
  ...rest
}) => (
  <Fragment>
    <TopToolbarTitleContainer
      className={clsx({
        'pf-u-mb-lg': !noData
      })}
      {...rest}
    >
      <LevelItem>
        <TextContent className="top-toolbar-title">
          <Text component={TextVariants.h2} className="pf-u-m-0 pf-u-mr-md">
            {title}
          </Text>
          {description && (
            <Text
              className="top-toolbar-title-description"
              component={TextVariants.p}
            >
              {description}
            </Text>
          )}
        </TextContent>
      </LevelItem>
      {children}
    </TopToolbarTitleContainer>
  </Fragment>
);

TopToolbarTitle.propTypes = {
  title: PropTypes.node,
  description: PropTypes.node,
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node)
  ]),
  noData: PropTypes.bool
};

TopToolbarTitle.defaultProps = {
  title: <ToolbarTitlePlaceholder />
};
