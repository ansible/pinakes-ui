/* eslint-disable react/prop-types */
import React from 'react';
import styled from 'styled-components';
import { SearchIcon, CloseIcon } from '@patternfly/react-icons';
import { ToolbarItem, TextInput } from '@patternfly/react-core';

const FilterInputGroup = styled.div`
  position: relative;
  width: 300px;
  height: 36px;
  padding-right: 0px;
  margin-left: 0px;
`;

const FilterInput = styled(TextInput)`
  position: absolute;
  width: 300px;
  padding-right: 34px;
  margin-left: 0px;
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

export interface FilterToolbarItemProps {
  searchValue?: string;
  onFilterChange: (value: string) => void;
  placeholder?: string;
  isClearable?: boolean;
}
const FilterToolbarItem: React.ComponentType<FilterToolbarItemProps> = ({
  searchValue = '',
  onFilterChange,
  placeholder,
  isClearable = false,
  ...rest
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
        {...rest}
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

export default FilterToolbarItem;
