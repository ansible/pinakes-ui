import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Button } from '@patternfly/react-core';
import { PageHeader } from '@red-hat-insights/insights-frontend-components';
import { PageHeaderTitle } from '@red-hat-insights/insights-frontend-components';
import { Section } from '@red-hat-insights/insights-frontend-components';
import { connect } from 'react-redux';
import './addprovider.scss';
import propTypes from 'prop-types';
import {fetchproviderDataFormat, addProvider} from "../../Store/Actions/ProviderActions";
import Form from "react-jsonschema-form";


const schema1 = {
  type: "object",
  required: ["title"],
  properties: {
    title: {type: "string", title: "Title", default: "A new provider"},
    done: {type: "boolean", title: "Done?", default: false}
  }
};

const schema = {
  "title":"Add an Openshift Provider",
  "type":"object",
  "properties":{
    "name":{"title":"Provider Name","type":"string"},
    "url":{"title":"URL","type":"string"},
    "verify_ssl":{"title":"Verify SSL","type":"boolean", "default":false},
    "credentials": {
      "type": "array",
      "title": "Credentials",
      "items": [
        { "name": "username",
          "title": "User",
          "type": "string",
          "default": ""
        },
        { "name": "passwod",
          "title": "Password",
          "type": "string",
          "minlength": 6
        }
      ]
    },
  },
  "required":["name","credentials", "url"],
};

const uischema={
  "credentials": {
    "type": "array",
    "title": "Credentials",
    "items": [
      { },
      {
        "ui:widget": "password",
      }
    ]
  }
};


class AddProviderForm extends Component {

  fetchData() {
    let defaultProps = {};
    this.props.fetchproviderDataFormat();
  };

  componentDidMount() {
    this.fetchData();
    this.onSubmit = this.onSubmit.bind(this);
    this.onCancel = this.onCancel.bind(this);
  };


  onSubmit (data) {
    addProvider(data.formData);
    console.log("Data submitted: ", data.formData);
    this.props.history.push('/catalog/catalogitems/');
  }

  onCancel () {
    console.log(" ");
    this.props.history.push('/catalog/catalogitems/');
  }


  onError(){
   console.log('Error in AddProvider form');
   this.props.history.push('/catalog/catalogitems/');
  };

  render( store ) {
    let providerDataFormat = {
      ...this.props.providerDataFormat,
      addProvider: this.props.addProvider,
      isLoading: this.props.isLoading,
      fetchData: () => this.fetchData()
    };
    console.log(providerDataFormat);
    const { handleSubmit } = this.props;

    return (
      <div className="pf-l-stack">
        <div className="pf-l-stack__item pf-m-secondary ">
          <PageHeader>
              <PageHeaderTitle title= 'Add Provider' />
          </PageHeader>
        </div>
        <div className="pf-l-stack">
          <Form schema={schema} uiSchema={uischema}
              onSubmit={this.onSubmit}
              onCancel={this.onCancel}
              onError={this.onError} >
            <div>
              <Button variant="primary" type="submit">Submit</Button>
              <Button variant="secondary" type="button"  onClick={this.onCancel}>Cancel</Button>
            </div>
          </Form>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
    return { providerDataFormat: state.ProviderStore.providerDataFormat,
        addProvider: state.ProviderStore.addProvider,
        isLoading: state.ProviderStore.isLoading};
}

const mapDispatchToProps = dispatch => {
    return {
        fetchproviderDataFormat: () => dispatch(fetchproviderDataFormat()),
        addProvider: () => dispatch(addProvider())
    };
};

AddProviderForm.propTypes = {
  providerDataFormat: propTypes.object,
  providerInput: propTypes.object,
  isLoading: propTypes.bool,
  history: propTypes.object,
  fetchproviderDataFormat: propTypes.func,
  addProvider: propTypes.func
};

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(AddProviderForm)
);
