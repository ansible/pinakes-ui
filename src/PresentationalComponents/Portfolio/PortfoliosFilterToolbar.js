import React from 'react';
import { Toolbar } from '@patternfly/react-core';
import OrderToolbarItem from '../Shared/OrderToolbarItem';
import FilterToolbarItem from '../Shared/FilterToolbarItem';
import '../Shared/toolbarschema.scss';

const PortfoliosFilterToolbar = ({ onFilterChange, filterValue, ...props }) => (
  <Toolbar className="searchToolbar">
    <FilterToolbarItem { ...props } searchValue={ filterValue } onFilterChange={ onFilterChange } placeholder={ 'Find a Portfolio' }/>
    <OrderToolbarItem { ...props }/>
  </Toolbar>
);

export default PortfoliosFilterToolbar;
