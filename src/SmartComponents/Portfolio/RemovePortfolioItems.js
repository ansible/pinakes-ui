import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Button, Level, Toolbar, ToolbarGroup, ToolbarItem  } from '@patternfly/react-core';
import TopToolbar, { TopToolbarTitle } from '../../PresentationalComponents/Shared/top-toolbar';
import FilterToolbarItem from '../../PresentationalComponents/Shared/FilterToolbarItem';
import './removeportfolioitems.scss';

const RemovePortfolioItems = ({ portfolioRoute, onRemove, portfolioName, filterValue, onFilterChange, disableButton }) => (
  <TopToolbar>
    <TopToolbarTitle title={ `Remove products: ${portfolioName}` } />
    <Level>
      <Toolbar>
        <ToolbarGroup>
          <ToolbarItem>
            <FilterToolbarItem placeholder="Filter by name..." searchValue={ filterValue } onFilterChange={ onFilterChange } />
          </ToolbarItem>
        </ToolbarGroup>
        <ToolbarGroup>
          <ToolbarItem>
            <Link to={ portfolioRoute }>
              <Button variant="link" aria-label="Cancel removing portfolio items">Cancel</Button>
            </Link>
          </ToolbarItem>
        </ToolbarGroup>
        <ToolbarGroup>
          <ToolbarItem>
            <Button isDisabled={ disableButton } variant="danger" aria-label="Remove selected portfolio items" onClick={ onRemove }>Remove</Button>
          </ToolbarItem>
        </ToolbarGroup>
      </Toolbar>
    </Level>
  </TopToolbar>
);

RemovePortfolioItems.propTypes = {
  onCancel: PropTypes.func,
  onRemove: PropTypes.func,
  portfolioRoute: PropTypes.string,
  portfolioName: PropTypes.string,
  filterValue: PropTypes.string.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  disableButton: PropTypes.bool
};

RemovePortfolioItems.defaultProps = {
  disableButton: false
};

export default RemovePortfolioItems;
