import React from 'react';
import { Form as PFForm } from 'patternfly-react';
import propTypes from 'prop-types';
import { connect } from 'react-redux';
import Form from "react-jsonschema-form";
import { BarLoader } from 'react-spinners';
import { PageHeader, PageHeaderTitle} from '@red-hat-insights/insights-frontend-components';
import { Bullseye, Button } from '@patternfly/react-core'
import '../../Utilities/jschema.scss';
import {fetchServicePlanParameters, fetchServicePlans, sendSubmitOrder} from "../../Store/Actions/OrderActions";

const uiSchema =
{
  "plans": {
    "ui:widget": "radio",
    "ui:options": {
      "inline": false
    }
  }
};

class OrderServiceFormStepConfiguration extends React.Component {
  constructor(props) {
    super(props);
    this.initialState = {
      showOrder: false,
      activeStepIndex: 1,
      stepParametersValid: false,
    };

    this.state = { ...this.initialState };
  }

  componentDidMount() {
    console.log('Component did mount - props:');
    console.log(this.props);
    this.onSubmit = this.onSubmit.bind(this);
    const {provider_id, catalog_id} = this.props;
    const plan_id = this.props.selectedPlan || catalog_id;
    this.props.fetchServicePlanParameters(provider_id, catalog_id, plan_id);
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
    const plan_id = this.props.selectedPlan || catalog_id;
    sendSubmitOrder({ provider_id: provider_id, catalog_id: catalog_id, plan_id: plan_id, plan_parameters: this.formDatatoArray(data.formData)});
    this.props.hideModal();
   }

  render() {
    if (!this.props.isLoading && this.props.planParameters ) {
      console.log('Plan Parameters schema: ', this.props.planParameters);
      return (
        <PFForm horizontal>
          <PFForm.FormGroup>
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
    planParameters:  state.OrderStore.planParameters
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchServicePlanParameters: (provider_id, catalog_id, plan_id) => dispatch(fetchServicePlanParameters(provider_id, catalog_id, plan_id)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(OrderServiceFormStepConfiguration);
