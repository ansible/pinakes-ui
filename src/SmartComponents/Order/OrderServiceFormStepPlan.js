import React from 'react';
import { Form as PFForm, Radio } from 'patternfly-react';
import '../../Utilities/jschema.scss';
import propTypes from 'prop-types';
import { connect } from 'react-redux';
import Form from "react-jsonschema-form";
import { BarLoader } from 'react-spinners';
import { PageHeader, PageHeaderTitle } from '@red-hat-insights/insights-frontend-components';
import { Bullseye } from '@patternfly/react-core'
import {fetchServicePlans} from "../../Store/Actions/OrderActions";


const uiSchema =
{
  "plans": {
    "ui:widget": "radio",
    "ui:options": {
      "inline": false
    }
  }
};


class OrderServiceFormStepPlan extends React.Component {
  constructor(props) {
    super(props);
    this.initialState = {
      showOrder: false,
      activeStepIndex: 1,
      stepParametersValid: false,
    };

    this.state = {...this.initialState};
  }

  componentDidMount() {
    console.log('Plan Component did mount - data:', this.props);
    const {provider_id, catalog_id} = this.props.servicedata;
    this.props.fetchPlans(provider_id, catalog_id);
  }

  render() {

    if (!this.props.isLoading) {
      const schema = {
        "type": "object",
        "title": "Select a Plan",
        "properties": {
          "plans": {
            "type": "string",
            "enum":this.props.servicePlans.map( a => a.description ),
          }
        }
      };

      console.log( "Plans: ", this.props.servicePlans);

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
                <BarLoader color={'#00b9e4'} loading={this.props.isLoading}/>
              </Bullseye>
            </PFForm.FormGroup>
          </PFForm>
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
    selectedPlan: state.OrderStore.selectedPlan,
    servicePlans: state.OrderStore.servicePlans,
  }
};

const mapDispatchToProps = dispatch => {
  return {
    fetchPlans: (provider_id, catalog_id) => dispatch(fetchServicePlans(provider_id, catalog_id)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(OrderServiceFormStepPlan);
