import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Button, CardHeader, Modal } from '@patternfly/react-core';
import { connect } from 'react-redux';
import '../Order/orderservice.scss';
import PropTypes from 'prop-types';
import { OrderServiceFormSteps } from '../Order/OrderServiceFormConstants';
import CatItemSvg from '../../assets/images/vendor-openshift.svg';
import ImageWithDefault from '../../PresentationalComponents/Shared/ImageWithDefault';
class OrderModal extends Component {
  state = {
    activeStepIndex: 0
  };

  onNext = () => this.setState((prevState) => ({ activeStepIndex: prevState.activeStepIndex + 1 }));

  renderStepPage = (componentPage, props) => {
    const StepComponent = componentPage;
    return (<StepComponent { ...props } />);
  };

  render() {
    const { activeStepIndex } = this.state;
    const steps = OrderServiceFormSteps;
    return this.props.serviceData ? (
      <Modal
        isOpen
        title=""
        onClose={ () => this.props.history.push(this.props.closeUrl) }
        style={ { maxWidth: 800 } }
      >
        <CardHeader className="order_header">
          <ImageWithDefault src = { this.props.serviceData.imageUrl || CatItemSvg } width="40" />
          { this.props.serviceData.name }
        </CardHeader>
        { this.renderStepPage(steps[activeStepIndex].page, this.props.serviceData) }
        { (activeStepIndex < steps.length - 1) &&
          <Button variant="primary" aria-label="Order portfolio item" onClick={ this.onNext }>
            Order
          </Button>
        }
      </Modal>
    ) : null;
  }
}

OrderModal.propTypes = {
  orderData: PropTypes.func,
  serviceData: PropTypes.object,
  closeUrl: PropTypes.string.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired
};

const mapStateToProps = ({
  portfolioReducer: { portfolioItems },
  orderReducer: { isLoading, selectedItem, servicePlans }
}, { match: { params: { itemId }}}) => ({
  isLoading,
  selectedItem,
  servicePlans,
  serviceData: portfolioItems.find(({ id }) => id == itemId) // eslint-disable-line eqeqeq
});

export default withRouter(connect(mapStateToProps)(OrderModal));
