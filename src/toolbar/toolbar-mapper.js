import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Level,
  LevelItem,
  ToolbarItem,
  ToolbarGroup
} from '@patternfly/react-core';

import FilterToolbarItem from '../presentational-components/shared/filter-toolbar-item';
import TopToolbar, {
  TopToolbarTitle
} from '../presentational-components/shared/top-toolbar';
import AppTabs from '../presentational-components/shared/app-tabs';
import CatalogLink from '../smart-components/common/catalog-link';
import { StyledToolbar } from '../presentational-components/styled-components/toolbars';

const ToolbarButton = ({ title, ...props }) => (
  <Button {...props}>{title}</Button>
);

ToolbarButton.propTypes = {
  title: PropTypes.string.isRequired
};

const AppToolbar = ({ ...props }) => (
  <StyledToolbar className="pf-u-pr-lg" {...props} />
);

const toolbarMapper = {
  TopToolbar,
  TopToolbarTitle,
  Toolbar: AppToolbar,
  ToolbarGroup,
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
