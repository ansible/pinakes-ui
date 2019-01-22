import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import propTypes from 'prop-types';
import { Toolbar, ToolbarGroup, ToolbarItem, DropdownItem, Dropdown, DropdownPosition, KebabToggle, Title, Button } from '@patternfly/react-core';
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
          dropdownItems={ [
            <DropdownItem component="button" aria-label="Edit Portfolio" key="edit-portfolio">
              <Link to={ this.props.editPortfolioRoute }>
                Edit Portfolio
              </Link>
            </DropdownItem>,
            <DropdownItem component="button" aria-label="Remove Portfolio" key="delete-portfolio">
              <Link to={ this.props.removePortfolioRoute }>
                Remove Portfolio
              </Link>
            </DropdownItem>
          ] }
          isPlain
        />
      );
    };

    render() {
      return (
        <Toolbar className="toolbar-padding">
          <ToolbarGroup>
            <ToolbarItem>
              { this.props.title && (<Title size={ '2xl' }> { this.props.title }</Title>) }
            </ToolbarItem>
          </ToolbarGroup>
          <ToolbarGroup className={ 'pf-u-ml-auto-on-xl' }>
            <ToolbarItem>
              <Link to={ this.props.addProductsRoute }>
                <Button variant="link" aria-label="Add Products to Portfolio">
                  Add Products
                </Button>
              </Link>
            </ToolbarItem>
            <ToolbarItem>
              <Link to={ this.props.removeProductsRoute }>
                <Button variant="plain" aria-label="Remove Products from Portfolio">
                  Remove Products
                </Button>
              </Link>
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
  title: propTypes.string,
  onClickEditPortfolio: propTypes.func,
  addProductsRoute: propTypes.string.isRequired,
  removeProductsRoute: propTypes.string.isRequired,
  editPortfolioRoute: propTypes.string.isRequired,
  removePortfolioRoute: propTypes.string.isRequired
};

export default PortfolioActionToolbar;
