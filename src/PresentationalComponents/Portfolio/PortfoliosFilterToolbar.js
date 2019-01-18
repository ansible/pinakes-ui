import React from 'react';
import { Toolbar } from '@patternfly/react-core';
import PropTypes from 'prop-types';
import OrderToolbarItem from '../Shared/OrderToolbarItem';
import FilterToolbarItem from '../Shared/FilterToolbarItem';
import '../Shared/toolbarschema.scss';

const PortfoliosFilterToolbar = ({ onFilterChange, filterValue, ...props }) => (
  <Toolbar className="searchToolbar">
    <FilterToolbarItem { ...props } searchValue={ filterValue } onFilterChange={ onFilterChange } placeholder={ 'Find a Portfolio' }/>
    <OrderToolbarItem { ...props }/>
  </Toolbar>
);

PortfoliosFilterToolbar.propTypes = {
  onFilterChange: PropTypes.func.isRequired,
  filterValue: PropTypes.string
};

export default PortfoliosFilterToolbar;
