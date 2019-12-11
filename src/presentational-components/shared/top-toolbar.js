import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Level, LevelItem, Text, TextContent, TextVariants  } from '@patternfly/react-core';
import { ToolbarTitlePlaceholder } from './loader-placeholders';
import CatalogBreadcrumbs from './breadcrubms';
import './top-toolbar.scss';

const TopToolbar = ({ children, paddingBottom, breadcrumbs, ...rest }) => (
  <div className={ `pf-u-pt-lg pf-u-pr-lg pf-u-pl-lg ${paddingBottom ? 'pf-u-pb-md' : ''} top-toolbar` } { ...rest }>
    { breadcrumbs && (
      <CatalogBreadcrumbs />
    ) }
    { children }
  </div>
);

TopToolbar.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired,
  paddingBottom: PropTypes.bool,
  breadcrumbs: PropTypes.bool
};

TopToolbar.defaultProps = {
  paddingBottom: true,
  breadcrumbs: true
};

export default TopToolbar;

export const TopToolbarTitle = ({ title, children, ...rest }) => (
  <Fragment>
    <Level className="pf-u-mb-md" { ...rest }>
      <LevelItem>
        <TextContent className="top-toolbar-title">
          { <Text component={ TextVariants.h2 }>{ title }</Text> }
        </TextContent>
      </LevelItem>
      { children }
    </Level>
  </Fragment>
);

TopToolbarTitle.propTypes = {
  title: PropTypes.node,
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node)
  ])
};

TopToolbarTitle.defaultProps = {
  title: <ToolbarTitlePlaceholder />
};
