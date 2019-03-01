import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Dropdown, DropdownItem, DropdownPosition, KebabToggle, Toolbar, ToolbarGroup, ToolbarItem } from '@patternfly/react-core';
import FilterToolbarItem from '../Shared/FilterToolbarItem';
import '../Shared/toolbarschema.scss';

const PortfolioFilterToolbar = ({
  addProductsRoute,
  isLoading,
  editPortfolioRoute,
  removePortfolioRoute,
  removeProductsRoute,
  ...props
}) => {
  const [ isKebabOpen, setKebabOpen ] = useState(false);
  return (
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
        <ToolbarItem>
          <Dropdown
            onToggle={ setKebabOpen }
            position={ DropdownPosition.right }
            toggle={ <KebabToggle onToggle={ setKebabOpen }/> }
            isOpen={ isKebabOpen }
            dropdownItems={ [
              <DropdownItem aria-label="Edit Portfolio" key="edit-portfolio">
                <Link to={ editPortfolioRoute } role="link" className="pf-c-dropdown__menu-item">
                  Edit
                </Link>
              </DropdownItem>,
              <DropdownItem aria-label="Share Portfolio" key="share-portfolio">
                <span role="link" className="pf-c-dropdown__menu-item">
                  Share
                </span>
              </DropdownItem>,
              <DropdownItem aria-label="Remove Portfolio" key="delete-portfolio">
                <Link to={ removePortfolioRoute } role="link" className="pf-c-dropdown__menu-item destructive-color">
                  Delete
                </Link>
              </DropdownItem>
            ] }
          />
        </ToolbarItem>
      </ToolbarGroup>
    </Toolbar>
  );};

export default PortfolioFilterToolbar;
