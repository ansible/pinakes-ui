import React from 'react';
import { Form as PFForm, Radio } from 'patternfly-react';
import propTypes from 'prop-types';
import { connect } from 'react-redux';
import Form from "react-jsonschema-form";
import { BarLoader } from 'react-spinners';
import { PageHeader, PageHeaderTitle, Button } from '@red-hat-insights/insights-frontend-components';
import { Bullseye } from '@patternfly/react-core'
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

const demoData = {
  parameters: {
    "DATABASE_SERVICE_NAME": {
      "default": "postgresql",
      "description": "The name of the OpenShift Service exposed for the database.",
      "title": "Database Service Name",
      "type": "string"
    },
    "MEMORY_LIMIT": {
      "default": "512Mi",
      "description": "Maximum amount of memory the container can use.",
      "title": "Memory Limit",
      "type": "string"
    },
    "NAMESPACE": {
      "default": "openshift",
      "description": "The OpenShift Namespace where the ImageStream resides.",
      "title": "Namespace",
      "type": "string"
    },
    "POSTGRESQL_DATABASE": {
      "default": "sampledb",
      "description": "Name of the PostgreSQL database accessed.",
      "title": "PostgreSQL Database Name",
      "type": "string"
    },
    "POSTGRESQL_PASSWORD": {
      "default": "",
      "description": "Password for the PostgreSQL connection user.",
      "title": "PostgreSQL Connection Password",
      "type": "string"
    },
    "POSTGRESQL_USER": {
      "default": "",
      "description": "Username for PostgreSQL user that will be used for accessing the database.",
      "title": "PostgreSQL Connection Username",
      "type": "string"
    },
    "POSTGRESQL_VERSION": {
      "default": "9.6",
      "description": "Version of PostgreSQL image to be used (9.4, 9.5, 9.6 or latest).",
      "title": "Version of PostgreSQL Image",
      "type": "string"
    },
    "VOLUME_CAPACITY": {
      "default": "1Gi",
      "description": "Volume space available for data, e.g. 512Mi, 2Gi.",
      "title": "Volume Capacity",
      "type": "string"
    }
  }
}


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
    const {provider_id, catalog_id} = this.props.servicedata;
    const plan_id = this.props.selectedPlan || catalog_id;
    this.props.fetchServicePlanParameters(provider_id, catalog_id, plan_id);
  }

  onSubmit (data) {
    console.log("Data submitted: ", data.formData);
    const {provider_id, catalog_id} = this.props.servicedata;
    const plan_id = this.props.selectedPlan || catalog_id;
    sendSubmitOrder({ provider_id: provider_id, catalog_id: catalog_id, plan_id: plan_id, plan_parameters: data.formData});
    this.setState({showOrder: false});
  }

  render() {
    console.log('Plan Parameters: ', {...this.props.planParameters});
    if (!this.props.isLoading && this.props.planParameters && this.props.planParameters.length ) {
      const schema = {
        "type": "object",
        "title": "Configuration",
        "properties": demoData.parameters
      };

      console.log('Plan Parameters: ', this.props.planParameters[0]);

      return (
        <PFForm horizontal>
          <PFForm.FormGroup>
            <div>
              <Form schema={schema} uiSchema={uiSchema} onSubmit={this.onSubmit}>
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
