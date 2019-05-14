import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Button, Toolbar, ToolbarItem, ToolbarGroup } from '@patternfly/react-core';

import FilterToolbarItem from '../presentational-components/shared/filter-toolbar-item';
import TopToolbar, { TopToolbarTitle } from '../presentational-components/shared/top-toolbar';

const ToolbarButton = ({ title, ...props }) => <Button { ...props }>{ title }</Button>;

ToolbarButton.propTypes = {
  title: PropTypes.string.isRequired
};

const toolbarMapper = {
  TopToolbar,
  TopToolbarTitle,
  Toolbar,
  ToolbarGroup,
  ToolbarItem,
  FilterToolbarItem,
  Link,
  Button: ToolbarButton
};

export const toolbarComponentTypes = {
  TOP_TOOLBAR: 'TopToolbar',
  TOP_TOOLBAR_TITLE: 'TopToolbarTitle',
  TOOLBAR: 'Toolbar',
  TOOLBAR_ITEM: 'ToolbarItem',
  TOOLBAR_GROUP: 'ToolbarGroup',
  FILTER_TOOLBAR_ITEM: 'FilterToolbarItem',
  LINK: 'Link',
  BUTTON: 'Button'
};

export default toolbarMapper;
