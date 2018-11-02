import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Button, Grid, Row, Modal } from '@patternfly/react-core';
import { PageHeader } from '@red-hat-insights/insights-frontend-components';
import { PageHeaderTitle } from '@red-hat-insights/insights-frontend-components';
import { Section } from '@red-hat-insights/insights-frontend-components';
import { connect } from 'react-redux';
import './orderservice.scss';
import propTypes from 'prop-types';
import { OrderStore } from '../../Store/Reducers/OrderStore';
import { Icon, Form } from 'patternfly-react';
import { bindMethods, consoleLog } from '../../Helpers/Shared/Helper';
import { OrderServiceFormSteps } from '../Order/OrderServiceFormConstants';
import { Wizard } from 'patternfly-react';
import CatItemSvg from '../../assets/images/vendor-openshift.svg';
import ImageWithDefault from '../../PresentationalComponents/ImageWithDefault';

class OrderModal extends Component {
    constructor(props) {
        super(props);
        this.initialState = {
            serviceData: {},
            activeStepIndex: 0
        };

        this.state = { ...this.initialState };
    }

    componentDidMount() {
        bindMethods(this, [ 'onCancel', 'onStep', 'onNext', 'onBack', 'onSubmit' ]);
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
        consoleLog('OnNext: ActiveStpeIndex:', activeStepIndex);

        if (activeStepIndex < numberSteps - 1) {
            this.setState({ activeStepIndex: activeStepIndex + 1 });
        }

        consoleLog('NextStep: ActiveStepIndex:', this.state.activeStepIndex);
    }

    onBack() {
        let { activeStepIndex } = this.state;

        if (activeStepIndex >= 1) {
            this.setState({ activeStepIndex: activeStepIndex - 1 });
        }
    }

    onSubmit(event) {
        consoleLog('OnSubmit');
        this.setState({ activeStepIndex: 1 });
    }

    onCancel() {
        this.setState({ showOrder: false });
    }

    imgTitle(serviceData) {
        return (
            <div>
                <table>
                    <tbody>
                        <tr>
                            <td><ImageWithDefault src = { serviceData.imageUrl || CatItemSvg } defaultSrc={ CatItemSvg } width="100" height="" /></td>
                            <td><h3> { serviceData.name } </h3></td>
                        </tr>
                    </tbody>
                </table>
            </div>);
    }

    renderWizardSteps() {
        const { activeStepIndex } = this.state;
        const wizardSteps = OrderServiceFormSteps;
        const activeStep = wizardSteps[activeStepIndex];

        return wizardSteps.map((step, stepIndex) => {
            return (
                <Wizard.Step
                    key={ stepIndex }
                    stepIndex={ stepIndex }
                    step={ step.step }
                    label={ step.label }
                    title={ step.title }
                    activeStep={ activeStep && activeStep.step }
                    onClick={ e => this.onStep(activeStep && activeStep.step) }
                />
            );
        });
    };

    render() {
        const showOrder = this.props.open;

        if (!showOrder)
        {return null;}
        else {
            const { activeStepIndex } = this.state;
            const wizardSteps = OrderServiceFormSteps;
            consoleLog('props in OrderModal ', this.props);
            consoleLog('state in OrderModal ', this.state);

            return (
                <React.Fragment>
                    <Wizard.Steps steps={ this.renderWizardSteps(this.props.servicedata) }/>
                    <Wizard.Row>
                        <Wizard.Main>
                            <Grid>
                                { wizardSteps.map((step, stepIndex) => {
                                    return (
                                        <Wizard.Contents key={ step.title } stepIndex={ stepIndex } activeStepIndex={ activeStepIndex }>
                                            { renderStepWizardPage(wizardSteps[stepIndex].page, this.props.servicedata) }
                                        </Wizard.Contents>
                                    );
                                }) }
                                { activeStepIndex !== wizardSteps.length - 1 && (
                                    <div>
                                        <br/>
                                        <br/>
                                        <Button variant="primary" type="button" onClick={ this.onNext }>
                                            Order<Icon type="fa" name="angle-right"/>
                                        </Button>
                                    </div>
                                ) }
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
    return (<StepComponent { ...props } />);
};

OrderModal.propTypes = {
    orderData: propTypes.func,
    showOrder: propTypes.bool,
    servicedata: propTypes.object,
    stepParametersValid: propTypes.bool,
    fulfilled: propTypes.bool,
    error: propTypes.bool,
    history: propTypes.object,
    open: propTypes.bool
};
function mapStateToProps(state) {
    return {
        isLoading: state.OrderStore.isLoading,
        selectedItem: state.OrderStore.selectedItem,
        servicePlans: state.OrderStore.servicePlans
    };
}

;

export default withRouter(connect(mapStateToProps)(OrderModal));
