import React from 'react';
import propTypes from 'prop-types';
import { Toolbar, ToolbarGroup, ToolbarItem, Title, Button } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import spacingStyles from '@patternfly/patternfly-next/utilities/Spacing/spacing.css';
import '../../SmartComponents/Portfolio/portfolio.scss';
import '../Shared/toolbarschema.scss';

const PortfolioOrderToolbar = ({ title }) => (
  <Toolbar className="searchToolbar">
    <ToolbarGroup>
      <ToolbarItem className={ css(spacingStyles.mrXl) }>
        { title && <Title size={ '2xl' }> { title }</Title> }
      </ToolbarItem>
    </ToolbarGroup>
    <ToolbarGroup className={ 'pf-u-ml-auto-on-xl' }>
      <ToolbarItem className={ css(spacingStyles.mrXL) }>
        <Button variant="link" id="ordersButton">
          <i className="fas fa-shopping-cart" aria-hidden="true"></i>
            Orders
        </Button>
      </ToolbarItem>
    </ToolbarGroup>
  </Toolbar>
);

PortfolioOrderToolbar.propTypes = {
  title: propTypes.string
};

export default PortfolioOrderToolbar;

