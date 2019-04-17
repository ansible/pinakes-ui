import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownPosition,
  KebabToggle,
  LevelItem,
  Toolbar,
  ToolbarGroup,
  ToolbarItem
} from '@patternfly/react-core';

import { TopToolbarTitle } from '../shared/top-toolbar';
import FilterToolbarItem from '../shared/filter-toolbar-item';

const PortfolioFilterToolbar = ({
  addProductsRoute,
  isLoading,
  removeProductsRoute,
  editPortfolioRoute,
  removePortfolioRoute,
  sharePortfolioRoute,
  title,
  ...props
}) => {
  const [ isKebabOpen, setKebabOpen ] = useState(false);
  return (
    <Fragment>
      <TopToolbarTitle title={ title }>
        <LevelItem>
          <div className="toolbar-override">
            <span className="toolbar-override-item">
              <Link to={ sharePortfolioRoute }>
                <Button variant="secondary">
                        Share
                </Button>
              </Link>
            </span>
            <span>
              <Link to={ editPortfolioRoute }>
                <Button variant="link">
                            Edit
                </Button>
              </Link>
            </span>
            <span>
              <Dropdown
                onToggle={ setKebabOpen }
                position={ DropdownPosition.right }
                toggle={ <KebabToggle onToggle={ setKebabOpen }/> }
                isOpen={ isKebabOpen }
                isPlain
                dropdownItems={ [
                  <DropdownItem aria-label="Remove Portfolio" key="delete-portfolio">
                    <Link to={ removePortfolioRoute } role="link" className="pf-c-dropdown__menu-item destructive-color">
                            Delete
                    </Link>
                  </DropdownItem>
                ] }
              />
            </span>
          </div>
        </LevelItem>
      </TopToolbarTitle>
      <Toolbar>
        <ToolbarGroup>
          <ToolbarItem>
            <FilterToolbarItem { ...props } placeholder={ 'Filter by name...' }/>
          </ToolbarItem>
        </ToolbarGroup>
        <ToolbarGroup>
          <ToolbarItem>
            <Link to={ addProductsRoute }>
              <Button isDisabled={ isLoading } variant="primary" aria-label="Add Products to Portfolio">
                Add products
              </Button>
            </Link>
          </ToolbarItem>
        </ToolbarGroup>
        <ToolbarGroup>
          <ToolbarItem>
            <Link to={ removeProductsRoute }>
              <Button isDisabled={ isLoading } variant="link" className="destructive-color" aria-label="Remove Products from Portfolio">
                Remove products
              </Button>
            </Link>
          </ToolbarItem>
        </ToolbarGroup>
      </Toolbar>
    </Fragment>
  );
};

PortfolioFilterToolbar.propTypes = {
  addProductsRoute: PropTypes.string.isRequired,
  isLoading: PropTypes.bool,
  editPortfolioRoute: PropTypes.string.isRequired,
  sharePortfolioRoute: PropTypes.string.isRequired,
  removePortfolioRoute: PropTypes.string.isRequired,
  removeProductsRoute: PropTypes.string.isRequired,
  title: PropTypes.string
};

export default PortfolioFilterToolbar;
