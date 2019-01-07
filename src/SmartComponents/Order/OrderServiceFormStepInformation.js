import React from 'react';
import { Form } from 'patternfly-react';
import propTypes from 'prop-types';
import { connect } from 'react-redux';

class OrderServiceFormStepInformation extends React.Component {
  state = {
    showOrder: false,
    activeStepIndex: 0,
    stepParametersValid: false
  };

  render() {
    return (
      <Form horizontal>
        <Form.FormGroup>
          { this.props.description }
        </Form.FormGroup>
      </Form>
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
