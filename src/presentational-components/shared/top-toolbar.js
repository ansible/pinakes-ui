import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Level, LevelItem, Text, TextContent, TextVariants  } from '@patternfly/react-core';
import { ToolbarTitlePlaceholder } from './loader-placeholders';
import CatalogBreadrubms from './breadcrubms';
import './top-toolbar.scss';

const TopToolbar = ({ children, paddingBottom, breadcrumbs, ...rest }) => (
  <div className={ `pf-u-pt-lg pf-u-pr-lg pf-u-pl-xl top-toolbar` } { ...rest }>
    { breadcrumbs && (
      <Level className="pf-u-mb-lg">
        <CatalogBreadrubms />
      </Level>
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
          { <Text component={ TextVariants.h2 }>{ title || <ToolbarTitlePlaceholder /> }</Text> }
        </TextContent>
      </LevelItem>
      { children }
    </Level>
  </Fragment>
);

TopToolbarTitle.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node)
  ])
};
