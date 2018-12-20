import React, { Component } from 'react';
import { Toolbar } from '@patternfly/react-core';
import OrderToolbarItem from '../Shared/OrderToolbarItem';
import FilterToolbarItem from '../Shared/FilterToolbarItem';
import '../Shared/toolbarschema.scss';

class PortfoliosFilterToolbar extends Component {
  render() {
    return (
      <Toolbar className="searchToolbar">
        <FilterToolbarItem { ...this.props } placeholder={ 'Find a Portfolio' }/>
        <OrderToolbarItem { ...this.props }/>
      </Toolbar>);
  };
};

export default PortfoliosFilterToolbar;
