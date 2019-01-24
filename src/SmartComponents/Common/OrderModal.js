import React, { Component } from 'react';
import { Button, CardHeader } from '@patternfly/react-core';
import { connect } from 'react-redux';
import '../Order/orderservice.scss';
import propTypes from 'prop-types';
import { OrderServiceFormSteps } from '../Order/OrderServiceFormConstants';
import CatItemSvg from '../../assets/images/vendor-openshift.svg';
import ImageWithDefault from '../../PresentationalComponents/Shared/ImageWithDefault';

class OrderModal extends Component {
  state = {
    serviceData: {},
    activeStepIndex: 0
  };

  onNext = () => this.setState((prevState, props) => ({ activeStepIndex: prevState.activeStepIndex + 1 }));

  renderStepPage = (componentPage, props) => {
    const StepComponent = componentPage;
    return (<StepComponent { ...props } />);
  };

  render() {
    const showOrder = this.props.open;

    if (!showOrder) {
      return null;
    }

    const { activeStepIndex } = this.state;
    const steps = OrderServiceFormSteps;

    return (
      <React.Fragment>
        <CardHeader className="order_header">
          <ImageWithDefault src = { this.props.servicedata.imageUrl || CatItemSvg } width="40" />
          { this.props.servicedata.name }
        </CardHeader>
        { this.renderStepPage(steps[activeStepIndex].page, this.props.servicedata) }
        { (activeStepIndex < steps.length - 1) &&
            <Button variant="primary" aria-label="Order portfolio item" onClick={ this.onNext }>
              Order
            </Button>
        }
      </React.Fragment>
    );
  }
}

OrderModal.propTypes = {
  orderData: propTypes.func,
  showOrder: propTypes.bool,
  servicedata: propTypes.object,
  stepParametersValid: propTypes.bool,
  fulfilled: propTypes.bool,
  error: propTypes.bool,
  open: propTypes.bool
};

const mapStateToProps = ({ orderReducer: { isLoading, selectedItem, servicePlans }}) => ({
  isLoading,
  selectedItem,
  servicePlans
});

export default connect(mapStateToProps)(OrderModal);
