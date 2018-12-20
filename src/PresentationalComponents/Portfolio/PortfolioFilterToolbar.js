import React from 'react';
import { Toolbar } from '@patternfly/react-core';
import OrderToolbarItem from '../Shared/OrderToolbarItem';
import FilterToolbarItem from '../Shared/FilterToolbarItem';
import '../Shared/toolbarschema.scss';

const PortfolioFilterToolbar = props => (
  <Toolbar style={ { backgroundColor: '#FFFFFF' } }>
    <FilterToolbarItem { ...props } placeholder={ 'Find a Product' }/>
    <OrderToolbarItem { ...props }/>
  </Toolbar>
);

export default PortfolioFilterToolbar;
