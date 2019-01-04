import React from 'react';
import propTypes from 'prop-types';
import { Toolbar, ToolbarGroup, ToolbarItem, Title } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import spacingStyles from '@patternfly/patternfly-next/utilities/Spacing/spacing.css';
import OrderToolbarItem from '../Shared/OrderToolbarItem';
import '../../SmartComponents/Portfolio/portfolio.scss';
import '../Shared/toolbarschema.scss';

const PortfolioOrderToolbar = ({ title }) => (
  <Toolbar className="searchToolbar">
    <ToolbarGroup>
      <ToolbarItem className={ css(spacingStyles.mrXl) }>
        { title && <Title size={ '2xl' }> { title }</Title> }
      </ToolbarItem>
    </ToolbarGroup>
    <OrderToolbarItem/>
  </Toolbar>
);

PortfolioOrderToolbar.propTypes = {
  title: propTypes.string
};

export default PortfolioOrderToolbar;

