import React from 'react';
import PropTypes from 'prop-types';
import { Level, LevelItem } from '@patternfly/react-core';
import TopToolbar, { TopToolbarTitle } from '../shared/top-toolbar';
import FilterToolbarItem from '../shared/filter-toolbar-item';

const PlatformToolbar = ({ searchValue, onFilterChange, title, children }) => (
  <TopToolbar>
    <TopToolbarTitle title={ title } />
    <Level>
      <LevelItem>
        <FilterToolbarItem searchValue={ searchValue } onFilterChange={ onFilterChange } placeholder="Filter by name..." />
      </LevelItem>
      <LevelItem>
        { children }
      </LevelItem>
    </Level>
  </TopToolbar>
);

PlatformToolbar.propTypes = {
  searchValue: PropTypes.string,
  onFilterChange: PropTypes.func.isRequired,
  title: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node)
  ])
};

export default PlatformToolbar;
