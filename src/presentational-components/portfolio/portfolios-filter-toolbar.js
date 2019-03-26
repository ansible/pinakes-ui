import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Toolbar, ToolbarItem, ToolbarGroup } from '@patternfly/react-core';
import PropTypes from 'prop-types';
import FilterToolbarItem from '../shared/filter-toolbar-item';

const PortfoliosFilterToolbar = ({ onFilterChange, filterValue, ...props }) => (
  <Toolbar className="pf-u-mt-md">
    <ToolbarGroup>
      <ToolbarItem>
        <FilterToolbarItem { ...props } searchValue={ filterValue } onFilterChange={ onFilterChange } placeholder="Filter by name..." />
      </ToolbarItem>
    </ToolbarGroup>
    <ToolbarGroup>
      <ToolbarItem>
        <Link to="/portfolios/add-portfolio">
          <Button
            variant="primary"
            aria-label="Create portfolio"
          >
              Create portfolio
          </Button>
        </Link>
      </ToolbarItem>
    </ToolbarGroup>
  </Toolbar>
);

PortfoliosFilterToolbar.propTypes = {
  onFilterChange: PropTypes.func.isRequired,
  filterValue: PropTypes.string
};

export default PortfoliosFilterToolbar;
