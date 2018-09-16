import React from 'react';
import '../../Utilities/jschema.scss';
import propTypes from 'prop-types';
import { connect } from 'react-redux';
import { BarLoader } from 'react-spinners';
import { PageHeader, PageHeaderTitle } from '@red-hat-insights/insights-frontend-components';
import { Bullseye, Radio } from '@patternfly/react-core'
import {fetchServicePlans, setSelectedPlan} from "../../Store/Actions/OrderActions";
import { Form } from 'patternfly-react'
import {bindMethods} from "../../Helpers/Order/OrderHelper";

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
}

class OrderServiceFormStepPlan extends React.Component {
  constructor(props) {
    super(props);
    this.initialState = {
      showOrder: false,
      activeStepIndex: 1,
      selectedPlan: null,
      stepParametersValid: false,
    };

    this.state = {...this.initialState};
    bindMethods(this, ['handleChange', 'planOptions', 'onSubmit']);
  }

  componentDidMount() {
    console.log('Plan Component did mount - data:', this.props);
    const {provider_id, catalog_id} = this.props;
    this.props.fetchPlans(provider_id, catalog_id);
  }

  handleChange (arg, event)  {
    const plan = event.currentTarget.value;
    this.props.setSelectedPlan(plan);
  };

  planOptions() {
    let options = [];
    let selected_id = this.props.selectedPlan ? this.props.selectedPlan : this.props.servicePlans[0].plan_id;
    let onChange = this.handleChange;

    this.props.servicePlans.forEach(function(plan, option, _array) {
      let new_option = optionRow(plan, option, selected_id, onChange);
      options.push(new_option);
    });
    return options;
  }

  onSubmit(){

  }

  render() {
    if (!this.props.isLoading && this.props.servicePlans.length > 0){
      return (
        <Form>
          <Bullseye>
            <div>
              <h3>Select Plan:</h3>
              <div>{this.planOptions()}</div>
            </div>
          </Bullseye>
        </Form>
      )
    }
    else {
      return (
        <Form>
          <Bullseye>
            <BarLoader color={'#00b9e4'} loading={this.props.isLoading} />
          </Bullseye>
        </Form>
      );
    }
  }
}

OrderServiceFormStepPlan.propTypes = {
  orderData: propTypes.func,
  serviceData: propTypes.object,
  showOrder: propTypes.bool,
  stepParametersValid: propTypes.bool,
  fulfilled: propTypes.bool,
  error: propTypes.bool,
  fetchPlans: propTypes.func,
};


function mapStateToProps(state) {
  return {
    isLoading: state.OrderStore.isLoading,
    servicePlans: state.OrderStore.servicePlans,
    selectedPlan: state.OrderStore.selectedPlan
  }
};

const mapDispatchToProps = dispatch => {
  return {
    fetchPlans: (provider_id, catalog_id) => dispatch(fetchServicePlans(provider_id, catalog_id)),
    setSelectedPlan: (plan_id) => dispatch(setSelectedPlan(plan_id))
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(OrderServiceFormStepPlan);
