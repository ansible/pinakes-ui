import React from 'react';
import propTypes from 'prop-types';
import { SearchIcon } from '@patternfly/react-icons';
import { ToolbarItem, TextInput } from '@patternfly/react-core';

const FilterToolbarItem = ({ searchValue, onFilterChange, placeholder }) => (
  <ToolbarItem>
    <div className="toolbar-filter-input-group">
      <TextInput
        placeholder={ placeholder }
        value={ searchValue }
        type="text"
        onChange={ onFilterChange }
        aria-label="Find product button"
      />
      <SearchIcon />
    </div>
  </ToolbarItem>
);

FilterToolbarItem.propTypes = {
  onFilterChange: propTypes.func.isRequired,
  placeholder: propTypes.string,
  searchValue: propTypes.string
};

FilterToolbarItem.defaultProps = {
  searchValue: ''
};

export default FilterToolbarItem;
