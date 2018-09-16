import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Button, Grid, Row } from '@patternfly/react-core';
import { PageHeader } from '@red-hat-insights/insights-frontend-components';
import { PageHeaderTitle } from '@red-hat-insights/insights-frontend-components';
import { Section } from '@red-hat-insights/insights-frontend-components';
import { connect } from 'react-redux';
import './orderservice.scss';
import propTypes from 'prop-types';
import {OrderStore} from "../../Store/Reducers/OrderStore";
import { Icon, Form } from 'patternfly-react';
import {bindMethods} from "../../Helpers/Order/OrderHelper";
import {OrderServiceFormSteps} from '../Order/OrderServiceFormConstants';
import {Wizard} from 'patternfly-react';
import CatItemSvg from '../../assets/images/vendor-openshift.svg';
import ImageWithDefault from '../../PresentationalComponents/ImageWithDefault';

class OrderModal extends Component {
  constructor(props) {
    super(props);
    this.initialState = {
      serviceData: {},
      activeStepIndex: 0,
      stepParametersValid: false,
    };

    this.state = { ...this.initialState };
  }

  componentDidMount() {
    bindMethods(this, ['onCancel', 'onStep', 'onNext', 'onBack', 'onSubmit']);
  }

  onStep(stepIndex) {

  }

  onNext() {
    const { activeStepIndex } = this.state;
    const numberSteps = OrderServiceFormSteps.length;

    if (activeStepIndex < numberSteps - 1) {
      this.setState({ activeStepIndex: activeStepIndex + 1 });
    }
  }

  onBack() {
    let { activeStepIndex } = this.state;

    if (activeStepIndex >= 1) {
      this.setState({ activeStepIndex: activeStepIndex - 1 });
    }
  }

  onSubmit(event) {
    const { orderData } = this.props;
    const { stepParametersValid } = this.state;

    if (stepParametersValid) {
      // toDO - add submit functionality
      this.setState({ activeStepIndex: 1 });
    }
  }

  onCancel() {
    this.setState({showOrder: false});
  }

  imgTitle(serviceData){
    return (
    <div>
      <table>
        <tbody>
        <tr>
          <td><ImageWithDefault src = {serviceData.imageUrl || CatItemSvg} defaultSrc={CatItemSvg} width="100" height="" /></td>
          <td><h3> {serviceData.name} </h3></td>
        </tr>
        </tbody>
      </table>
    </div>);
  }

  renderWizardSteps(serviceData) {
    const { activeStepIndex } = this.state;
    const wizardSteps = OrderServiceFormSteps;
    const activeStep = wizardSteps[activeStepIndex];

    return wizardSteps.map((step, stepIndex) => {
      return (
          <Wizard.Step
              key={stepIndex}
              stepIndex={stepIndex}
              step={step.step}
              label={step.label}
              title={step.title}
              activeStep={activeStep && activeStep.step}
              onClick={e => this.onStep(activeStep && activeStep.step)}
          />
      );
    });
  };

  render() {
    const showOrder = this.props.open;

    if(!showOrder)
      return null;
    else {
      const { activeStepIndex, stepParametersValid } = this.state;
      const wizardSteps = OrderServiceFormSteps;
      console.log('props in OrderServiceForm ', this.props);
      console.log('state in OrderServiceForm ', this.props);

      return (
          <React.Fragment>
            <Wizard.Steps steps={this.renderWizardSteps(this.props.servicedata)}/>
              <Wizard.Row>
                <Wizard.Main>
                  <Grid>
                    {wizardSteps.map((step, stepIndex) => {
                      return (
                          <Wizard.Contents key={step.title} stepIndex={stepIndex} activeStepIndex={activeStepIndex}>
                            {renderStepWizardPage(wizardSteps[stepIndex].page, this.props.servicedata)}
                          </Wizard.Contents>
                      );
                    })}
                    {activeStepIndex !== wizardSteps.length - 1 && (
                        <div>
                          <br/>
                          <br/>
                          <Button variant="primary" type="button" onClick={this.onNext}>
                            Order<Icon type="fa" name="angle-right"/>
                          </Button>
                        </div>
                    )}
                  </Grid>
                </Wizard.Main>
              </Wizard.Row>
          </React.Fragment>
      );
    }
  }
}

const renderStepWizardPage = (componentPage, props) => {
  const StepComponent = componentPage;
  return ( <StepComponent {...props} />);
};

OrderModal.propTypes = {
  orderData: propTypes.func,
  serviceData: propTypes.object,
  stepParametersValid: propTypes.bool,
  fulfilled: propTypes.bool,
  error: propTypes.bool,
  history: propTypes.object,
};


function mapStateToProps(state) {
  return {
    isLoading: state.OrderStore.isLoading,
    selectedItem: state.OrderStore.selectedItem,
    servicePlans: state.OrderStore.servicePlans,
    planParameters: state.OrderStore.planParameters,
  }
};

export default withRouter(connect(mapStateToProps)(OrderModal));
