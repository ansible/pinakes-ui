import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Button } from '@patternfly/react-core';
import propTypes from 'prop-types';
import './addplatform.scss';
import { Main, PageHeader, PageHeaderTitle } from '@red-hat-insights/insights-frontend-components';
import { addPlatform } from '../../Store/Actions/AddPlatformActions';
import { addAlert, removeAlert } from '../../Store/Actions/AlertActions';
import { FormRenderer } from '@red-hat-insights/insights-frontend-components/components/Forms'

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
  onSubmit = (data) => {
      this.props.addPlatform(data);
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
                      <FormRenderer schema={schema} uiSchema={uischema}
                          onSubmit={this.onSubmit}
                          onCancel={this.onCancel} />
                  </div>
              </div>
          </Main>
      );
  }
}

function mapStateToProps(state) {
    return { addPlatform: state.AddPlatformStore.addPlatform,
        isLoading: state.AddPlatformStore.isLoading };
}

const mapDispatchToProps = dispatch => bindActionCreators({
    removeAlert,
    addPlatform,
    addAlert,
}, dispatch);

AddPlatformForm.propTypes = {
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

