import React from 'react';
import { connect } from 'react-redux';
import propTypes from 'prop-types';
import { Toolbar, ToolbarGroup, ToolbarItem } from '@patternfly/react-core';
import Select from 'react-select';
import '../../PresentationalComponents/Platform/platform.scss';
import FilterToolbarItem from '../../PresentationalComponents/Shared/FilterToolbarItem';

const PlatformSelectToolbar = ({ onOptionSelect, platforms, onFilterChange, searchValue }) => {
  const dropdownItems = platforms.map(platform => ({ value: platform.id, label: platform.name, id: platform.id }));
  return (
    <Toolbar className="searchToolbar">
      <FilterToolbarItem onFilterChange={ onFilterChange } searchValue={ searchValue } placeholder="Filter products"/>
      <ToolbarGroup className="searchPlatforms">
        <ToolbarItem>
          { platforms &&
            <Select
              isMulti={ true }
              placeholder={ 'Filter by Platform' }
              options={ dropdownItems }
              onChange={ onOptionSelect }
              closeMenuOnSelect={ false }
            /> }
        </ToolbarItem>
      </ToolbarGroup>
    </Toolbar>);
};

PlatformSelectToolbar.propTypes = {
  platforms: propTypes.array,
  onOptionSelect: propTypes.func,
  onFilterChange: propTypes.func.isRequired,
  searchValue: propTypes.string
};

const mapStateToProps = ({ platformReducer: { platforms }}) => ({ platforms });

export default connect(mapStateToProps)(PlatformSelectToolbar);
