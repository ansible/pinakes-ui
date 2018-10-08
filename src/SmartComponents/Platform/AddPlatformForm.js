import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Button } from '@patternfly/react-core';
import Form from 'react-jsonschema-form';
import propTypes from 'prop-types';
import './addplatform.scss';
import { Main, PageHeader, PageHeaderTitle } from '@red-hat-insights/insights-frontend-components';
import { fetchproviderDataFormat, addPlatform } from '../../Store/Actions/PlatformActions';
import { addAlert, removeAlert } from '../../Store/Actions/AlertActions';
import Alerts from '../Common/Alerts';

const schema = {
  title: 'Add an Openshift Platform',
  type: 'object',
  properties: {
    name: { title: 'Platform Name', type: 'string' },
    description: { title: 'Description', type: 'string' },
    url: { title: 'URL', type: 'string' },
    verify_ssl: { title: 'Verify SSL', type: 'boolean', default: false },
    user: { title: 'User Name', type: 'string', default: '' },
    token: { title: 'Token', type: 'string', default: '' },
    password: { title: 'Password', type: 'string', minlength: 6 }
  },
  required: ['name', 'url']
};

const uischema = {
  password: {
    'ui:widget': 'password'
  }
};

class AddPlatformForm extends Component {

  componentDidMount() {
    this.fetchData();
  };

  fetchData = () => {
    let defaultProps = {};
    this.props.fetchproviderDataFormat();
  };


  onSubmit = (data) => {
    this.props.addPlatform(data.formData);
  }

  onCancel = () => {
    this.props.addAlert({
      variant: 'warning',
      title: 'Adding platform',
      description: 'Adding platform was cancelled by the user.'
    })
    this.props.history.push('/catalog/catalogitems/');
  }

  onError = () => {
    console.log('Error in AddPlatform form');
    this.props.history.push('/catalog/catalogitems/');
  };


  render(store) {
    let providerDataFormat = {
      ...this.props.providerDataFormat,
      addPlatform: this.props.addPlatform,
      isLoading: this.props.isLoading,
      fetchData: () => this.fetchData()
    };
    console.log(providerDataFormat);
    const { handleSubmit } = this.props;

    return (
        <Main>
          <div className="pf-l-stack">
            <div className="pf-l-stack__item pf-m-secondary ">
              <PageHeader>
                <PageHeaderTitle title= 'Add Platform' />
              </PageHeader>
            </div>
            <div className="pf-l-stack">
              <Form schema={schema} uiSchema={uischema}
                    onSubmit={this.onSubmit}
                    onCancel={this.onCancel}
                    onError={this.onError} >
                <div>
                  <Button variant="primary" type="submit">Submit</Button>
                  <Button variant="secondary" type="button" onClick={this.onCancel}>Cancel</Button>
                </div>
              </Form>
            </div>
          </div>
        </Main>
    );
  }
}

function mapStateToProps(state) {
  return { providerDataFormat: state.PlatformStore.providerDataFormat,
    addPlatform: state.PlatformStore.addPlatform,
    isLoading: state.PlatformStore.isLoading };
}

const mapDispatchToProps = dispatch => bindActionCreators({
  removeAlert,
  fetchproviderDataFormat,
  addPlatform,
  addAlert,
}, dispatch);

AddPlatformForm.propTypes = {
  providerDataFormat: propTypes.object,
  providerInput: propTypes.object,
  isLoading: propTypes.bool,
  history: propTypes.object,
  fetchproviderDataFormat: propTypes.func,
  addPlatform: propTypes.func
};

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(AddPlatformForm)
);

