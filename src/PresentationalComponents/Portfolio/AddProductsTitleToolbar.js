import React from 'react';
import propTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Toolbar, ToolbarGroup, ToolbarItem, Title, Button } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import spacingStyles from '@patternfly/patternfly-next/utilities/Spacing/spacing.css';
import flexStyles from '@patternfly/patternfly-next/utilities/Flex/flex.css';
import '../../SmartComponents/Portfolio/portfolio.scss';

const AddProductsTitleToolbar = ({ title, onClickAddToPortfolio, itemsSelected, portfolioRoute }) =>(
  <Toolbar
    className={ css(flexStyles.justifyContentSpaceBetween, spacingStyles.mxXl, spacingStyles.myMd) }
    style={ { backgroundColor: '#FFFFFF' } }
  >
    <ToolbarGroup>
      <ToolbarItem className={ css(spacingStyles.mrXl) }>
        { title &&  (<Title size={ '2xl' }> { 'Add Products: ' + title }</Title>) }
      </ToolbarItem>
    </ToolbarGroup>
    <ToolbarGroup className={ 'pf-u-ml-auto-on-xl' }>
      <ToolbarItem className={ css(spacingStyles.mxLg) }>
        <Link to={ portfolioRoute }>
          <Button variant="link" aria-label="Cancel Add Products to Portfolio">
            Cancel
          </Button>
        </Link>
      </ToolbarItem>
      <ToolbarItem className={ css(spacingStyles.mxLg) } >
        <Button key="addproducts"
          variant="primary"
          aria-label="Add Products to Portfolio"
          type="button" onClick={ onClickAddToPortfolio }
          isDisabled={ !itemsSelected }>
          Add
        </Button>
      </ToolbarItem>
    </ToolbarGroup>
  </Toolbar>
);

AddProductsTitleToolbar.propTypes = {
  history: propTypes.object,
  title: propTypes.string,
  onClickAddToPortfolio: propTypes.func,
  itemsSelected: propTypes.bool,
  portfolioRoute: propTypes.string.isRequired
};

export default AddProductsTitleToolbar;

