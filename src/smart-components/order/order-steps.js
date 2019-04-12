import React from 'react';
import PropTypes from 'prop-types';
import { Progress, ProgressMeasureLocation } from '@patternfly/react-core';

const OrderSteps = ({ requests }) => (
  <Progress
    style={ { minWidth: 200 } }
    value={ requests.length }
    title="Steps"
    size="sm"
    min={ 0 }
    max={ 4 }
    label={ `${requests.length} of 4` }
    measureLocation={ ProgressMeasureLocation.top }
  />
);

OrderSteps.propTypes = {
  requests: PropTypes.array.isRequired
};

export default OrderSteps;
