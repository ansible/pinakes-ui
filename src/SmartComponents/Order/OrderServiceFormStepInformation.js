import React from 'react';
import { CardBody } from '@patternfly/react-core';
import propTypes from 'prop-types';
import { connect } from 'react-redux';
import './orderservice.scss';

class OrderServiceFormStepInformation extends React.Component {
  state = {
    showOrder: false,
    activeStepIndex: 0,
    stepParametersValid: false
  };

  render() {
    return (
      <CardBody className="order_card">
        { this.props.description }
      </CardBody>
    );
  }
}

OrderServiceFormStepInformation.propTypes = {
  orderData: propTypes.func,
  showOrder: propTypes.bool,
  serviceData: propTypes.object,
  stepParametersValid: propTypes.bool,
  fulfilled: propTypes.bool,
  error: propTypes.bool,
  imageUrl: propTypes.string,
  description: propTypes.string,
  name: propTypes.string
};

const mapStateToProps = ({ orderReducer: { serviceData }}) => ({ serviceData });

export default connect(mapStateToProps)(OrderServiceFormStepInformation);
