/* eslint-disable react/prop-types */
import React, { ReactNode } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Label,
  Level,
  LevelItem,
  ToolbarItem,
  ToolbarContent,
  ButtonProps,
  LabelProps
} from '@patternfly/react-core';

import FilterToolbarItem from '../presentational-components/shared/filter-toolbar-item';
import TopToolbar, {
  TopToolbarTitle
} from '../presentational-components/shared/top-toolbar';
import AppTabs from '../presentational-components/shared/app-tabs';
import CatalogLink from '../smart-components/common/catalog-link';
import {
  StyledToolbar,
  StyledToolbarGroup,
  StyledToolbarProps
} from '../presentational-components/styled-components/toolbars';

export interface ToolbarButtonProps extends Omit<ButtonProps, 'title'> {
  title: ReactNode;
}

export interface ToolbarLabelProps extends Omit<LabelProps, 'title'> {
  title: ReactNode;
}

const ToolbarButton: React.ComponentType<ToolbarButtonProps> = ({
  title,
  ...props
}) => <Button {...props}>{title}</Button>;

ToolbarButton.propTypes = {
  title: PropTypes.string.isRequired
};

const ToolbarLabel: React.ComponentType<ToolbarLabelProps> = ({
  title,
  ...props
}) => <Label {...props}>{title}</Label>;

ToolbarLabel.propTypes = {
  title: PropTypes.string.isRequired
};

const AppToolbar: React.ComponentType<StyledToolbarProps> = ({
  children,
  ...props
}) => (
  <StyledToolbar className="pf-u-p-0" {...props}>
    <ToolbarContent className="pf-u-pl-0">{children}</ToolbarContent>
  </StyledToolbar>
);
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
  AppTabs,
  Label: ToolbarLabel
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
  TABS: 'AppTabs',
  LABEL: 'Label'
};

export default toolbarMapper;
