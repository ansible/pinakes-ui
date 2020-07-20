import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Level,
  LevelItem,
  ToolbarItem,
  ToolbarContent
} from '@patternfly/react-core';

import FilterToolbarItem from '../presentational-components/shared/filter-toolbar-item';
import TopToolbar, {
  TopToolbarTitle
} from '../presentational-components/shared/top-toolbar';
import AppTabs from '../presentational-components/shared/app-tabs';
import CatalogLink from '../smart-components/common/catalog-link';
import {
  StyledToolbar,
  StyledToolbarGroup
} from '../presentational-components/styled-components/toolbars';

const ToolbarButton = ({ title, ...props }) => (
  <Button {...props}>{title}</Button>
);

ToolbarButton.propTypes = {
  title: PropTypes.string.isRequired
};

const AppToolbar = ({ children, ...props }) => (
  <StyledToolbar className={'pf-u-p-0'} {...props}>
    <ToolbarContent className="pf-u-pl-0">{children}</ToolbarContent>
  </StyledToolbar>
);

AppToolbar.propTypes = {
  noWrap: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node)
  ])
};

const toolbarMapper = {
  TopToolbar,
  TopToolbarTitle,
  Toolbar: AppToolbar,
  ToolbarGroup: StyledToolbarGroup,
  ToolbarItem,
  FilterToolbarItem,
  Link: CatalogLink,
  Level,
  LevelItem,
  Button: ToolbarButton,
  AppTabs
};

export const toolbarComponentTypes = {
  TOP_TOOLBAR: 'TopToolbar',
  TOP_TOOLBAR_TITLE: 'TopToolbarTitle',
  TOOLBAR: 'Toolbar',
  TOOLBAR_ITEM: 'ToolbarItem',
  TOOLBAR_GROUP: 'ToolbarGroup',
  FILTER_TOOLBAR_ITEM: 'FilterToolbarItem',
  LINK: 'Link',
  BUTTON: 'Button',
  LEVEL: 'Level',
  LEVEL_ITEM: 'LevelItem',
  TABS: 'AppTabs'
};

export default toolbarMapper;
