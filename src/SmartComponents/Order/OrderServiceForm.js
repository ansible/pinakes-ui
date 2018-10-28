import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Button, Grid, Row, Modal } from '@patternfly/react-core';
import { PageHeader } from '@red-hat-insights/insights-frontend-components';
import { PageHeaderTitle } from '@red-hat-insights/insights-frontend-components';
import { Section } from '@red-hat-insights/insights-frontend-components';
import { connect } from 'react-redux';
import './orderservice.scss';
import propTypes from 'prop-types';
import {OrderStore} from "../../Store/Reducers/OrderStore";
import {Icon, Form } from 'patternfly-react';
import {bindMethods} from "../../Helpers/Order/OrderHelper";
import {OrderServiceFormSteps} from './OrderServiceFormConstants';
import {Wizard} from 'patternfly-react';

class OrderServiceForm extends Component {
    constructor(props) {
        super(props);
        this.initialState = {
            showOrder: false,
            serviceData: {},
            activeStepIndex: 0,
            stepParametersValid: false,
        };

        this.state = { ...this.initialState };
    }

    componentDidMount() {
        bindMethods(this, ['onCancel', 'onStep', 'onNext', 'onBack', 'onSubmit']);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            stepParametersValid: nextProps.stepParametersValid || false,
            showOrder: nextProps.showOrder
        });
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

    renderWizardSteps() {
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
                    activeStep={activeStep && activeStep.step}
                    onClick={e => this.onStep(activeStep && activeStep.step)}
                />
            );
        });
    };

    render() {
        const showOrder = this.state.showOrder;

        if(!showOrder)
            return null;
        else {
            const { activeStepIndex, stepParametersValid } = this.state;
            const wizardSteps = OrderServiceFormSteps;
            console.log('props in OrderServiceForm ', this.props);
            console.log('state in OrderServiceForm ', this.props);

            return (
                <React.Fragment>
                    <Modal show={showOrder} onHide={this.onCancel} key='OrderModal' dialogClassName="modal-lg wizard-pf">
                        <Wizard show={showOrder} key={'OrderWizard'}>
                            <Wizard.Body>
                                <Wizard.Steps steps={this.renderWizardSteps()}/>
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
                                            <Button variant="primary" type="button" disabled={!stepParametersValid} onClick={this.onNext}>
                        Order<Icon type="fa" name="angle-right"/>
                                            </Button>
                                        </Grid>
                                    </Wizard.Main>
                                </Wizard.Row>
                            </Wizard.Body>

                            <Modal.Footer className="wizard-pf-footer">
                                <Button
                                    variant="secondary" type="button"
                                    disabled={activeStepIndex === wizardSteps.length - 1}
                                    onClick={this.onCancel}
                                >
                  Cancel
                                </Button>
                                {activeStepIndex === wizardSteps.length - 1 && (
                                    <Button variant="primary" type="button" disabled="false" onClick={this.onSubmit}>
                      Order
                                    </Button>
                                )}
                                {activeStepIndex === wizardSteps.length - 1 && (
                                    <Button variant="secondary" type="button" onClick={this.onCancel}>
                      Close
                                    </Button>
                                )}
                            </Modal.Footer>
                        </Wizard>
                    </Modal>
                </React.Fragment>
            );
        }
    }
}

const renderStepWizardPage = (componentPage, props) => {
    const StepComponent = componentPage;
    return ( <StepComponent servicedata={props} />);
};

OrderServiceForm.propTypes = {
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

export default withRouter(connect(mapStateToProps)(OrderServiceForm));
