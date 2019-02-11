import React from 'react';
import PropTypes from 'prop-types';
import { Level, LevelItem } from '@patternfly/react-core';
import TopToolbar from '../Shared/top-toolbar';
import FilterToolbarItem from '../Shared/FilterToolbarItem';
import OrderToolbarItem from '../Shared/OrderToolbarItem';

const PlatformToolbar = ({ searchValue, onFilterChange }) => (
  <TopToolbar>
    <Level>
      <LevelItem>
        <FilterToolbarItem searchValue={ searchValue } onFilterChange={ onFilterChange } placeholder="Find a product" />
      </LevelItem>
      <LevelItem>
        <OrderToolbarItem />
      </LevelItem>
    </Level>
  </TopToolbar>
);

PlatformToolbar.propTypes = {
  searchValue: PropTypes.string,
  onFilterChange: PropTypes.func.isRequired
};

export default PlatformToolbar;
