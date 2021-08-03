/* eslint-disable react/prop-types */
import React, { useState, memo } from 'react';
import PropTypes from 'prop-types';
import {
  InternalSelect,
  InternalSelectProps
} from '@data-driven-forms/pf4-component-mapper/select';
import isEqual from 'lodash/isEqual';

const FilterSelect: React.ComponentType<InternalSelectProps> = ({
  onChange,
  ...props
}) => {
  const [stateValue, setValue] = useState(undefined);
  return (
    <div key="filter-select" id="filter-select" className="filter-select">
      <InternalSelect
        isDisabled={!props.options || props.options.length === 0}
        name="filter-select"
        simpleValue={false}
        onChange={(value) => {
          onChange && onChange(value || stateValue);
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
