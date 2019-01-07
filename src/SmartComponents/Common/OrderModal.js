import React, { Component } from 'react';
import { Button, Grid, Modal} from '@patternfly/react-core';
import { connect } from 'react-redux';
import './orderservice.scss';
import propTypes from 'prop-types';
import { OrderServiceFormSteps } from '../Order/OrderServiceFormConstants';
import CatItemSvg from '../../assets/images/vendor-openshift.svg';
import ImageWithDefault from '../../PresentationalComponents/Shared/ImageWithDefault';
import { Wizard } from 'patternfly-react';

// useless
const renderStepWizardPage = (componentPage, props) => {
  const StepComponent = componentPage;
  return (<StepComponent { ...props } />);
};

class OrderModal extends Component {
  state = {
    activeStepIndex: 0
  };

  onNext = () => {
    const { activeStepIndex } = this.state;
    const numberSteps = OrderServiceFormSteps.length;

    if (activeStepIndex < numberSteps - 1) {
      this.setState({ activeStepIndex: activeStepIndex + 1 });
    }
  }

  renderWizardSteps = () => {
    const { activeStepIndex } = this.state;
    const wizardSteps = OrderServiceFormSteps;
    const activeStep = wizardSteps[activeStepIndex];

    return wizardSteps.map((step, stepIndex) => (
      <Wizard.Step
        key={ stepIndex }
        stepIndex={ stepIndex }
        step={ step.step }
        label={ step.label }
        title={ step.title }
        activeStep={ activeStep && activeStep.step }
      />
    ));
  };

  render() {
    const showOrder = this.props.open;

    if (!showOrder) {
      return null;
    }

    const { activeStepIndex } = this.state;
    const wizardSteps = OrderServiceFormSteps;

    return (
      <div>
        <div>
          <ImageWithDefault src = { this.props.servicedata.imageUrl || CatItemSvg } width="40" />
          { this.props.servicedata.name }}
        </div>
        <Wizard.Steps steps={ this.renderWizardSteps(this.props.servicedata) }/>
        <Wizard.Row>
          <Wizard.Main>
            <Grid>
              { wizardSteps.map((step, stepIndex) => (
                <Wizard.Contents key={ step.title } stepIndex={ stepIndex } activeStepIndex={ activeStepIndex }>
                  { wizardSteps[stepIndex].page, this.props.servicedata }
                </Wizard.Contents>
              )) }
              { activeStepIndex !== wizardSteps.length - 1 && (
                <div>
                  <br/>
                  <br/>
                  <Button variant="primary" type="button" onClick={ this.onNext }>
                    Order
                  </Button>
                </div>
              ) }
            </Grid>
          </Wizard.Main>
        </Wizard.Row>
      </div>
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
