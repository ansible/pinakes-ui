import React from 'react';
// PF3?
import { Form as PFForm } from 'patternfly-react';
import propTypes from 'prop-types';
import { connect } from 'react-redux';
// replce with data driven form
import Form from 'react-jsonschema-form';
import { Bullseye, Button, Radio } from '@patternfly/react-core';
import '../../Utilities/jschema.scss';
import { fetchServicePlans, sendSubmitOrder } from '../../redux/Actions/OrderActions';
import { bindMethods } from '../../Helpers/Shared/Helper';

const uiSchema =
{
  plans: {
    'ui:widget': 'radio',
    'ui:options': {
      inline: false
    }
  }
};

const optionRow = (plan, option, selected_id, onChange) => {
  return (
    <div>
      <Radio
        value={ plan.plan_id }
        checked={ selected_id === plan.plan_id }
        name={ plan.name }
        aria-label={ plan.description }
        onChange={ onChange }
      />
      { plan.description }
      <br/>
      <br/>
    </div>);
};

class OrderServiceFormStepConfiguration extends React.Component {
  constructor(props) {
    super(props);
    bindMethods(this, [ 'handlePlanChange', 'planOptions', 'onSubmit' ]);
    this.state = {
      showOrder: false,
      activeStepIndex: 1,
      selectedPlan: null,
      selectedPlanIdx: 0
    };
  }

  componentDidMount() {
    console.log('Config Component did mount - props:', this.props);
    const { id } = this.props;
    this.props.fetchPlans(id);
  }

  handlePlanChange (arg, event)  {
    const plan = event.currentTarget.value;
    this.setState({ selectedPlan: plan });
    console.log('Plan Id changed to : ', plan);
  };

  planOptions() {
    let selected_id = this.state.selectedPlan ? this.state.selectedPlan : this.props.servicePlans[0].plan_id;
    let onChange = this.handlePlanChange;

    return this.props.servicePlans.map((plan, option) => optionRow(plan, option, selected_id, onChange));
  }

  onSubmit (data) {
    console.log('Data submitted: ', data.formData);
    const portfolioItemId = this.props.id;
    const service_plan_id = this.props.servicePlans[this.state.selectedPlanIdx].id;
    sendSubmitOrder({ portfolio_item_id: portfolioItemId, service_plan_ref: service_plan_id, service_parameters: data.formData });
    this.props.hideModal();
  };

  render() {
    if (!this.props.isLoading) {
      return (
        <PFForm horizontal>
          <PFForm.FormGroup>
            { (this.props.servicePlans.length > 1) &&
              <div>
                <h3>Select Plan:</h3>
                <div>{ this.planOptions() }</div>
              </div>
            }
            <div>
              { (!this.props.isLoading && this.props.servicePlans.length > 0) &&
                <Form schema={ this.props.servicePlans[this.state.selectedPlanIdx].create_json_schema } onSubmit={ this.onSubmit }>
                  <div>
                    <Button variant="primary" type="submit">Submit</Button>
                  </div>
                </Form>
              }
            </div>
          </PFForm.FormGroup>
        </PFForm>
      );
    }
    else {
      return (
        <PFForm horizontal>
          <PFForm.FormGroup>
            <Bullseye>
              <div>
                { this.props.isLoading && (<span color={ '#00b9e4' }> Loading...</span>) }
              </div>
            </Bullseye>
          </PFForm.FormGroup>
        </PFForm>
      );
    }
  }
}

OrderServiceFormStepConfiguration.propTypes = {
  orderData: propTypes.func,
  fetchPlans: propTypes.func,
  hideModal: propTypes.func,
  showOrder: propTypes.bool,
  isLoading: propTypes.bool,
  serviceData: propTypes.object,
  servicePlans: propTypes.object,
  stepParametersValid: propTypes.bool,
  fulfilled: propTypes.bool,
  error: propTypes.bool,
  imageURL: propTypes.string,
  id: propTypes.string,
  name: propTypes.string
};

const mapStateToProps = ({ orderReducer: { isLoading, servicePlans }}) => ({
  isLoading,
  servicePlans
});

const mapDispatchToProps = dispatch => ({
  fetchPlans: (portfolioItemId) => dispatch(fetchServicePlans(portfolioItemId))
});

export default connect(mapStateToProps, mapDispatchToProps)(OrderServiceFormStepConfiguration);
