import React, { Fragment } from 'react';
import Select from 'react-select';
import PropTypes from 'prop-types';
import { FilterIcon } from '@patternfly/react-icons';

import selectStyles from '../../constants/select-styles-override';

const ValueContainer = ({ children }) => (
  <Fragment>
    <FilterIcon style={ { marginLeft: 4 } } fill="#393F44" />
    { children }
  </Fragment>
);

ValueContainer.propTypes = {
  children: PropTypes.oneOfType([ PropTypes.node, PropTypes.arrayOf(PropTypes.node) ]).isRequired
};

const FilterSelect = props => (
  <Select
    styles={ selectStyles }
    components={ { ValueContainer } }
    { ...props }
  />
);

export default FilterSelect;

