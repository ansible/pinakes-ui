import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { SearchIcon, CloseIcon } from '@patternfly/react-icons';
import { ToolbarItem, TextInput } from '@patternfly/react-core';

const FilterInputGroup = styled.div`
  position: relative;
  width: 300px;
  height: 36px;
`;

const FilterInput = styled(TextInput)`
  position: absolute;
  width: 300px;
  background: transparent;
`;

const FilterIconsContainer = styled.span`
  position: absolute;
  right: 8px;
  top: 8px;
`;

const StyledCloseIcon = styled(CloseIcon)`
  z-index: 1000;
  fill: #72767b;
  :hover {
    fill: var(--pf-global--Color--100);
    cursor: pointer;
  }
`;

const StyledSearchIcon = styled(SearchIcon)`
  z-index: 1000;
  fill: #72767b;
`;

const FilterToolbarItem = ({
  searchValue,
  onFilterChange,
  placeholder,
  isClearable
}) => (
  <ToolbarItem>
    <FilterInputGroup>
      <FilterInput
        id="toolbar-filter"
        placeholder={placeholder}
        value={searchValue}
        type="text"
        onChange={onFilterChange}
        aria-label={placeholder}
      />
      <FilterIconsContainer>
        {(isClearable && searchValue && (
          <StyledCloseIcon
            width="16"
            height="16"
            onClick={() => onFilterChange('')}
          />
        )) || <StyledSearchIcon />}
      </FilterIconsContainer>
    </FilterInputGroup>
  </ToolbarItem>
);

FilterToolbarItem.propTypes = {
  onFilterChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  searchValue: PropTypes.string,
  isClearable: PropTypes.bool
};

FilterToolbarItem.defaultProps = {
  searchValue: '',
  isClearable: false
};

export default FilterToolbarItem;
