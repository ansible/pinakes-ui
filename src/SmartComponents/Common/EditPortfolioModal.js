import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import propTypes from 'prop-types';
import { Main, PageHeader, PageHeaderTitle } from '@red-hat-insights/insights-frontend-components';
import { addNotification } from '@red-hat-insights/insights-frontend-components/components/Notifications';
import { updatePortfolio, fetchPortfolios } from '../../redux/Actions/PortfolioActions';
import FormRenderer from './FormRenderer';

const schema = {
  type: 'object',
  properties: {
    name: { title: 'Name', type: 'string' },
    description: { title: 'Description', type: 'string' }
  },
  required: [ 'name', 'description' ]
};

class EditPortfolioModal extends Component {
  onSubmit = data => {
    this.props.updatePortfolio(data);
    this.props.closeModal();
  }

  onCancel = () => {
    this.props.addNotification({
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
  addNotification,
  updatePortfolio,
  fetchPortfolios
}, dispatch);

EditPortfolioModal.propTypes = {
  isLoading: propTypes.bool,
  addNotification: propTypes.func,
  updatePortfolio: propTypes.func,
  fetchPortfolios: propTypes.func,
  closeModal: propTypes.func,
  itemdata: propTypes.object
};

export default connect(mapStateToProps, mapDispatchToProps)(EditPortfolioModal);
