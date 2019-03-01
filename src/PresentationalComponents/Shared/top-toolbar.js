import React from 'react';
import PropTypes from 'prop-types';
import { Level, LevelItem, Text, TextContent, TextVariants  } from '@patternfly/react-core';
import { ToolbarTitlePlaceholder } from './LoaderPlaceholders';
import './top-toolbar.scss';

const TopToolbar = ({ children, paddingBottom }) => (
  <div className={ `pf-u-pt-xl pf-u-pr-xl pf-u-pl-xl ${paddingBottom ? 'pf-u-pb-xl' : ''} top-toolbar` }>
    { children }
  </div>
);

TopToolbar.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired,
  paddingBottom: PropTypes.bool
};

TopToolbar.defaultProps = {
  paddingBottom: true
};

export default TopToolbar;

export const TopToolbarTitle = ({ title, children }) => (
  <Level className="pf-u-mb-xl">
    <LevelItem>
      <TextContent className="top-toolbar-title">
        { <Text component={ TextVariants.h2 }>{ title || <ToolbarTitlePlaceholder /> }</Text> }
      </TextContent>
    </LevelItem>
    { children }
  </Level>
);

TopToolbarTitle.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node)
  ])
};
