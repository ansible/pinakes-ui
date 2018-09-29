import React from 'react';
import { Form as PFForm } from 'patternfly-react';
import propTypes from 'prop-types';
import { connect } from 'react-redux';
import Form from "react-jsonschema-form";
import { BarLoader } from 'react-spinners';
import { PageHeader, PageHeaderTitle} from '@red-hat-insights/insights-frontend-components';
import { Bullseye, Button, Radio } from '@patternfly/react-core'
import '../../Utilities/jschema.scss';
import {fetchServicePlanParameters, fetchServicePlans, sendSubmitOrder} from "../../Store/Actions/OrderActions";
import {bindMethods} from "../../Helpers/Shared/Helper";

const uiSchema =
{
  "plans": {
    "ui:widget": "radio",
    "ui:options": {
      "inline": false
    }
  }
};

const optionRow = ( plan, option, selected_id, onChange) => {
  return (
      <div>
        <Radio
            value={plan.plan_id}
            checked={selected_id === plan.plan_id}
            name={plan.name}
            aria-label={plan.description}
            onChange={onChange}
        />
        {plan.description}
        <br/>
        <br/>
      </div>)
};

class OrderServiceFormStepConfiguration extends React.Component {
  constructor(props) {
    super(props);
    this.initialState = {
      showOrder: false,
      activeStepIndex: 1,
      stepParametersValid: false,
      selectedPlan: null,
    };
    bindMethods(this, ['handlePlanChange', 'planOptions', 'onSubmit']);
    this.state = { ...this.initialState };
  }

  componentDidMount() {
    console.log('Component did mount - props:');
    console.log(this.props);
    const {provider_id, catalog_id} = this.props;
    this.props.fetchPlans(provider_id, catalog_id);
   }

  handlePlanChange (arg, event)  {
    const plan = event.currentTarget.value;
    this.setState({selectedPlan: plan});
    this.props.fetchServicePlanParameters(this.props.provider_id, this.props.catalog_id, plan);
    console.log('Plan Id changed to : ', plan );
  };

  planOptions() {
    let options = [];
    let selected_id = this.state.selectedPlan ? this.state.selectedPlan : this.props.servicePlans[0].plan_id;
    let onChange = this.handlePlanChange;

    this.props.servicePlans.forEach(function(plan, option, _array) {
      let new_option = optionRow(plan, option, selected_id, onChange);
      options.push(new_option);
    });
    return options;
 }


  formDatatoArray(obj){
    let keys = Object.keys(obj);
    let values = Object.values(obj);
    let params = [];
    for (let idx = 0; idx < keys.length; idx++) {
      params.push({name: keys[idx], value: values[idx]})
    }
    return params;
  }

  onSubmit (data) {
    console.log("Data submitted: ", data.formData);
    const {provider_id, catalog_id} = this.props;
    const plan_id = this.state.selectedPlan;
    sendSubmitOrder({ provider_id: provider_id, catalog_id: catalog_id, plan_id: plan_id, plan_parameters: this.formDatatoArray(data.formData)});
    this.props.hideModal();
  }

  componentDidUpdate(){
    if (!this.state.selectedPlan){
      this.setState({selectedPlan: this.props.servicePlans[0].plan_id});
      this.props.fetchServicePlanParameters(this.props.provider_id, this.props.catalog_id, this.props.servicePlans[0].plan_id);
    }
  }

  render() {
    if (!this.props.isLoading && ( this.props.servicePlans.length > 1 || this.props.planParameters )) {
      return (
        <PFForm horizontal>
          <PFForm.FormGroup>
            {(!this.props.isLoading && this.props.servicePlans.length > 1) &&
            <div>
              <h3>Select Plan:</h3>
              <div>{this.planOptions()}</div>
            </div>
            }

            <div>
              <Form schema={this.props.planParameters} uiSchema={uiSchema} onSubmit={this.onSubmit}>
                <div>
                  <Button variant="primary" type="submit">Submit</Button>
                </div>
              </Form>
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
                <BarLoader color={'#00b9e4'} loading={this.props.isLoading} />
              </Bullseye>
            </PFForm.FormGroup>
          </PFForm>
      );
    }
  }
}



OrderServiceFormStepConfiguration.propTypes = {
  orderData: propTypes.func,
  showOrder: propTypes.bool,
  serviceData: propTypes.object,
  stepParametersValid: propTypes.bool,
  fulfilled: propTypes.bool,
  fetchServicePlanParameters: propTypes.func,
  error: propTypes.bool
};


function mapStateToProps(state) {
  return {
    isLoading: state.OrderStore.isLoading,
    servicePlans: state.OrderStore.servicePlans,
    planParameters:  state.OrderStore.planParameters
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchPlans: (provider_id, catalog_id) => dispatch(fetchServicePlans(provider_id, catalog_id)),
    fetchServicePlanParameters: (provider_id, catalog_id, plan_id) => dispatch(fetchServicePlanParameters(provider_id, catalog_id, plan_id)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(OrderServiceFormStepConfiguration);
