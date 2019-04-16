import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import { Link } from 'react-router-dom';
import { FilterIcon } from '@patternfly/react-icons';
import { Level, Button, Toolbar, ToolbarGroup, ToolbarItem } from '@patternfly/react-core';
import TopToolbar, { TopToolbarTitle } from '../shared/top-toolbar';
import FilterToolbarItem from '../shared/filter-toolbar-item';
import selectStyles from '../../constants/select-styles-override';

const ValueContainer = ({ children }) => (
  <Fragment>
    <FilterIcon style={ { marginLeft: 4 } } fill="#393F44" />
    { children }
  </Fragment>
);

ValueContainer.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node)
  ]).isRequired
};

const PortfolioOrderToolbar = ({
  portfolioName,
  portfolioRoute,
  onClickAddToPortfolio,
  itemsSelected,
  onOptionSelect,
  options,
  onFilterChange,
  searchValue,
  children
}) => (
  <TopToolbar>
    <TopToolbarTitle title={ `Add products: ${portfolioName}` } />
    <Level  className="pf-u-mt-lg">
      <Toolbar>
        <ToolbarGroup>
          <ToolbarItem>
            <Select
              id="products-platform-select"
              styles={ selectStyles }
              isMulti={ false }
              placeholder={ 'Filter by Platform' }
              options={ options }
              onChange={ onOptionSelect }
              components={ { ValueContainer } }
            />
          </ToolbarItem>
          <ToolbarItem>
            <FilterToolbarItem onFilterChange={ onFilterChange } searchValue={ searchValue } placeholder="Filter products"/>
          </ToolbarItem>
        </ToolbarGroup>
        <ToolbarGroup>
          <ToolbarItem>
            <Link to={ portfolioRoute }>
              <Button variant="link" aria-label="Cancel Add products to Portfolio">
                Cancel
              </Button>
            </Link>
          </ToolbarItem>
        </ToolbarGroup>
        <ToolbarGroup>
          <ToolbarItem>
            <Button
              variant="primary"
              aria-label="Add products to Portfolio"
              type="button" onClick={ onClickAddToPortfolio }
              isDisabled={ !itemsSelected }>
              Add
            </Button>
          </ToolbarItem>
        </ToolbarGroup>
      </Toolbar>
      { children }
    </Level>
  </TopToolbar>
);

PortfolioOrderToolbar.propTypes = {
  portfolioName: PropTypes.string.isRequired,
  portfolioRoute: PropTypes.string.isRequired,
  onClickAddToPortfolio: PropTypes.func.isRequired,
  itemsSelected: PropTypes.bool,
  onOptionSelect: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]).isRequired
  })).isRequired,
  onFilterChange: PropTypes.func.isRequired,
  searchValue: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node)
  ])
};

export default PortfolioOrderToolbar;

