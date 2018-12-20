import React, { Component } from 'react';
import propTypes from 'prop-types';
import { Toolbar, ToolbarGroup, ToolbarItem, DropdownItem, Dropdown, DropdownPosition, KebabToggle, Title, Button } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import spacingStyles from '@patternfly/patternfly-next/utilities/Spacing/spacing.css';
import flexStyles from '@patternfly/patternfly-next/utilities/Flex/flex.css';
import '../../SmartComponents/Portfolio/portfolio.scss';

class PortfolioActionToolbar extends Component {

    state = {
      isKebabOpen: false
    };

    onKebabToggle = isOpen => {
      this.setState({
        isKebabOpen: isOpen
      });
    };

    buildPortfolioActionKebab = () => {
      const { isKebabOpen } = this.state;

      return (
        <Dropdown
          onToggle={ this.onKebabToggle }
          onSelect={ this.onKebabSelect }
          position={ DropdownPosition.right }
          toggle={ <KebabToggle onToggle={ this.onKebabToggle }/> }
          isOpen={ isKebabOpen }
          isPlain
        >
          <DropdownItem component="button" onClick={ this.props.onClickEditPortfolio } aria-label="Edit Portfolio">
                        Edit Portfolio
          </DropdownItem>
          <DropdownItem component="button" aria-label="Remove Portfolio">
                        Remove Portfolio
          </DropdownItem>
        </Dropdown>
      );
    };

    render() {
      return (
        <Toolbar className={ css(flexStyles.justifyContentSpaceBetween, spacingStyles.mxXl, spacingStyles.myMd) }>
          <ToolbarGroup>
            <ToolbarItem className={ css(spacingStyles.mrXl) }>
              { this.props.title && (<Title size={ '2xl' }> { this.props.title }</Title>) }
            </ToolbarItem>
          </ToolbarGroup>
          <ToolbarGroup className={ 'pf-u-ml-auto-on-xl' }>
            <ToolbarItem className={ css(spacingStyles.mxLg) }>
              <Button variant="link" onClick={ this.props.onClickAddProducts }  aria-label="Add Products to Portfolio">
                            Add Products
              </Button>
            </ToolbarItem>
            <ToolbarItem className={ css(spacingStyles.mxLg) }>
              <Button variant="plain" aria-label="Remove Products from Portfolio">
                            Remove Products
              </Button>
            </ToolbarItem>
            <ToolbarItem>
              { this.buildPortfolioActionKebab() }
            </ToolbarItem>
          </ToolbarGroup>
        </Toolbar>
      );
    }
}

PortfolioActionToolbar.propTypes = {
  history: propTypes.object,
  title: propTypes.string,
  onClickEditPortfolio: propTypes.func,
  onClickAddProducts: propTypes.func
};

export default PortfolioActionToolbar;
