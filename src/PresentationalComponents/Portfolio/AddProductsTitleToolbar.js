import React from 'react';
import propTypes from 'prop-types';
import { Toolbar, ToolbarGroup, ToolbarItem, Title, Button } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import spacingStyles from '@patternfly/patternfly-next/utilities/Spacing/spacing.css';
import flexStyles from '@patternfly/patternfly-next/utilities/Flex/flex.css';
import '../../SmartComponents/Portfolio/portfolio.scss';

const AddProductsTitleToolbar = ({ title, onClickCancelAddProducts, onClickAddToPortfolio }) =>(
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
        <Button variant="link" aria-label="Cancel Add Products to Portfolio" onClick={ onClickCancelAddProducts }>
          Cancel
        </Button>
      </ToolbarItem>
      <ToolbarItem className={ css(spacingStyles.mxLg) } >
        <Button variant="plain" aria-label="Add Products to Portfolio" onClick={ onClickAddToPortfolio }>
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
  onClickCancelAddProducts: propTypes.func
};

export default AddProductsTitleToolbar;

