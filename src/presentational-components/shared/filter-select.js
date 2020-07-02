import React, { useState, memo } from 'react';
import PropTypes from 'prop-types';
import { InternalSelect } from '@data-driven-forms/pf4-component-mapper/dist/cjs/select';
import { FilterIcon } from '@patternfly/react-icons';
import isEqual from 'lodash/isEqual';

const ValueContainer = ({ children }) => (
  <div className="filter-value-container" style={{ position: 'absolute' }}>
    <FilterIcon style={{ marginLeft: 6 }} fill="#393F44" />
    {children}
  </div>
);

ValueContainer.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node)
  ]).isRequired
};

const FilterSelect = ({ onChange, ...props }) => {
  const [stateValue, setValue] = useState(undefined);
  return (
    <div key="filter-select" id="filter-select" className="filter-select">
      <InternalSelect
        isDisabled={!props.options || props.options.length === 0}
        name="filter-select"
        simpleValue={false}
        onChange={(value) => {
          onChange(value || stateValue);
          setValue(value || stateValue);
        }}
        value={stateValue}
        {...props}
      />
    </div>
  );
};

FilterSelect.propTypes = {
  options: PropTypes.array,
  onChange: PropTypes.func.isRequired
};

export default memo(FilterSelect, (prevProps, nextProps) =>
  isEqual(prevProps.options, nextProps.options)
);
