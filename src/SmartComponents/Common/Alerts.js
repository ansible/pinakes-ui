import React from 'react';
import { connect } from 'react-redux';
import propTypes from 'prop-types';
import { removeAlert } from '../../redux/Actions/AlertActions';
import { Alert, Button } from '@patternfly/react-core';
import { TimesIcon } from '@patternfly/react-icons';

const Alerts = ({ alerts, removeAlert }) => (
  <div>
    { alerts.map(({ variant, title, description }, index) => (
      <Alert
        style={ { marginBottom: 10 } }
        key={ index }
        variant={ variant }
        title={ title }
        action={ (
          <Button
            aria-label="Close alert"
            variant="plain"
            onClick={ () => removeAlert(index) }
          >
            <TimesIcon />
          </Button>
        ) }
      >
        { description }
      </Alert>
    )) }
  </div>
);

const mapStateToProps = ({ alertReducer: { alerts }}) => ({
  alerts
});

Alerts.propTypes = {
  alerts: propTypes.array,
  removeAlert: propTypes.func
};

const mapDispatchToProps = dispatch => ({
  removeAlert: (index) => dispatch(removeAlert(index))
});

export default connect(mapStateToProps, mapDispatchToProps)(Alerts);
