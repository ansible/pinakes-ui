import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Button } from '@patternfly/react-core';
import propTypes from 'prop-types';
import { Main, PageHeader, PageHeaderTitle } from '@red-hat-insights/insights-frontend-components';
import { addPortfolioWithItem } from '../../Store/Actions/PortfolioActions';
import {PortfolioStore} from "../../Store/Reducers/PortfolioStore";
import {bindMethods} from "../../Helpers/Shared/Helper";
import { FormRenderer } from '@red-hat-insights/insights-frontend-components/components/Forms'

const schema = {
  type: 'object',
  properties: {
    name: { title: 'New Portfolio Name', type: 'string' },
    description: { title: 'Description', type: 'string' },
  },
  required: ['name', 'description']
};

class AddPortfolioModal extends Component {
   componentDidMount() {
    bindMethods( this, ['onSubmit', 'onCancel', 'onError']);
  };

  onSubmit (data) {
    addPortfolioWithItem(data.formData, this.itemdata);
    console.log('Data submitted: ', data.formData, this.itemdata);
    this.itemdata.hideModal();
  }

  onCancel () {
    console.log('Cancel Add Portfolio');
    this.itemdata.hideModal();
  }

  onError() {
    console.log('Error in AddPortfolioForm');
    this.itemdata.hideModal();
  };

  render() {
    console.log('Adding a New Portfolio');
    return (
        <Main title={ 'Add Portfolio'}>
          <div className="pf-l-stack">
            <div className="pf-l-stack__item pf-m-secondary ">
              <PageHeader>
                <PageHeaderTitle title= 'Create Portfolio and Add Product' />
              </PageHeader>
            </div>
            <div className="pf-l-stack">
              <FormRenderer schema={schema}
                    onSubmit={this.onSubmit}
                    onCancel={this.onCancel}
                    onError={this.onError} {...this.props}>
              </FormRenderer>
            </div>
          </div>
        </Main>
    );
  }
}

function mapStateToProps(state) {
  return { isLoading: state.PortfolioStore.isLoading };
}

AddPortfolioModal.propTypes = {
  isLoading: propTypes.bool,
  history: propTypes.object
};

export default withRouter(
    connect(
        mapStateToProps,
        null
    )(AddPortfolioModal)
);
