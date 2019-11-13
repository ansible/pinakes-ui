import React from 'react';
import PropTypes from 'prop-types';
import { ActionGroup, Button } from '@patternfly/react-core';

const CANCELABLE_STATES = [ 'Approval Pending' ];

const canCancel = state => CANCELABLE_STATES.includes(state);

const OrderToolbarActions = ({ state }) => (
  <ActionGroup>
    <Button isDisabled={ !canCancel(state) } type="button" className="pf-u-mr-md">
      Cancel order
    </Button>
    <Button type="button">
      Reorder
    </Button>
  </ActionGroup>
);

OrderToolbarActions.propTypes = {
  state: PropTypes.string
};

export default OrderToolbarActions;
