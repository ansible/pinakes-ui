import React from 'react';
import { Form as PFForm, Radio } from 'patternfly-react';
import propTypes from 'prop-types';
import { connect } from 'react-redux';
import Form from "react-jsonschema-form";
import { BarLoader } from 'react-spinners';
import { PageHeader, PageHeaderTitle } from '@red-hat-insights/insights-frontend-components';
import { Bullseye } from '@patternfly/react-core'
import '../../Utilities/jschema.scss';
import {fetchServicePlanParameters, fetchServicePlans} from "../../Store/Actions/OrderActions";


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
    console.log(this.props)
    const {provider_id, catalog_id} = this.props.servicedata;
    const plan_id = this.props.selectedPlan || catalog_id;
    this.props.fetchServicePlanParameters(provider_id, catalog_id, plan_id);
  }

  render() {
    if (!this.props.isLoading) {
      const schema = {
        "type": "object",
        "title": "Configuration",
        "properties": this.props.planParameters
      };

      console.log('Plan Parameters: ', this.props.planParameters);

      return (
        <PFForm horizontal>
          <PFForm.FormGroup>
            <div>
              <Form schema={schema} uiSchema={uiSchema}>
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
