import React from 'react';
import { Level, LevelItem } from '@patternfly/react-core';
import PropTypes from 'prop-types';
import OrderToolbarItem from '../Shared/OrderToolbarItem';
import FilterToolbarItem from '../Shared/FilterToolbarItem';
import TopToolbar from '../Shared/top-toolbar';
import '../Shared/toolbarschema.scss';

const PortfoliosFilterToolbar = ({ onFilterChange, filterValue, ...props }) => (
  <TopToolbar>
    <Level>
      <LevelItem>
        <FilterToolbarItem { ...props } searchValue={ filterValue } onFilterChange={ onFilterChange } placeholder="Find a Portfolio" />
      </LevelItem>
      <LevelItem>
        <OrderToolbarItem { ...props }/>
      </LevelItem>
    </Level>
  </TopToolbar>
);

PortfoliosFilterToolbar.propTypes = {
  onFilterChange: PropTypes.func.isRequired,
  filterValue: PropTypes.string
};

export default PortfoliosFilterToolbar;
