import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import propTypes from 'prop-types';
import { Main, PageHeader, PageHeaderTitle } from '@red-hat-insights/insights-frontend-components';
import { updatePortfolio, fetchPortfolios } from '../../redux/Actions/PortfolioActions';
import FormRenderer from './FormRenderer';
import { addAlert, removeAlert } from '../../redux/Actions/AlertActions';

const schema = {
  type: 'object',
  properties: {
    name: { title: 'Edit Portfolio', type: 'string' },
    description: { title: 'Description', type: 'string' }
  },
  required: [ 'name', 'description' ]
};

class EditPortfolioModal extends Component {
  onSubmit = data => {
    this.props.updatePortfolio(data)
    .then(() => { this.props.addAlert({
      variant: 'success',
      title: 'Success updating portfolio',
      description: 'The portfolio was updated successfully.'
    });
    this.props.fetchPortfolios();
    })
    .catch(() => this.props.addAlert({
      variant: 'danger',
      title: 'Failed updating portfolio',
      description: 'The portfolio was not updated successfuly.'
    }));
    this.props.closeModal();
  }

  onCancel = () => {
    this.props.addAlert({
      variant: 'warning',
      title: 'Editing portfolio',
      description: 'Edit portfolio was cancelled by the user.'
    });
    this.props.closeModal();
  }

  // Use pf4 components
  render() {
    return (
      <Main title={ 'Edit Portfolio' }>
        <div className="pf-l-stack">
          <div className="pf-l-stack__item pf-m-secondary ">
            <PageHeader>
              <PageHeaderTitle title= 'Edit Portfolio' />
            </PageHeader>
          </div>
          <div className="pf-l-stack">
            <FormRenderer
              schema={ schema }
              onSubmit={ this.onSubmit }
              onCancel={ this.onCancel }
              schemaType="mozilla"
            />
          </div>
        </div>
      </Main>
    );
  }
}

const mapStateToProps = ({ portfolioReducer: { isLoading }}) => ({ isLoading });

const mapDispatchToProps = dispatch => bindActionCreators({
  addAlert,
  removeAlert,
  updatePortfolio,
  fetchPortfolios
}, dispatch);

EditPortfolioModal.propTypes = {
  isLoading: propTypes.bool,
  history: propTypes.object,
  addAlert: propTypes.func,
  updatePortfolio: propTypes.func,
  fetchPortfolios: propTypes.func,
  closeModal: propTypes.func,
  itemdata: propTypes.object
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(EditPortfolioModal));
