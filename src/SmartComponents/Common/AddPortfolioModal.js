import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import propTypes from 'prop-types';
import { Main, PageHeader, PageHeaderTitle } from '@red-hat-insights/insights-frontend-components';
import { addPortfolio, fetchPortfolios } from '../../Store/Actions/PortfolioActions';
import FormRenderer from './FormRenderer';
import { addAlert, removeAlert } from '../../Store/Actions/AlertActions';

const schema = {
  type: 'object',
  properties: {
    name: { title: 'New Portfolio Name', type: 'string' },
    description: { title: 'Description', type: 'string' }
  },
  required: [ 'name', 'description' ]
};

class AddPortfolioModal extends Component {
  onSubmit = data => {
    let items = null;
    if (this.props.itemdata) {
      items = [ this.props.itemdata ];
    }

    this.props.addPortfolio(data, items)
    .then(() => { this.props.addAlert({
      variant: 'success',
      title: 'Success adding portfolio',
      description: 'The portfolio was added successfully.'
    });
    this.props.fetchPortfolios();
    })
    .catch(() => this.props.addAlert({
      variant: 'danger',
      title: 'Failed adding portfolio',
      description: 'The portfolio was not added successfuly.'
    }));
    this.props.closeModal();
  }

  onCancel = () => {
    this.props.addAlert({
      variant: 'warning',
      title: 'Adding portfolio',
      description: 'Adding portfolio was cancelled by the user.'
    });
    this.props.closeModal();
  }

  render() {
    let title = 'Create Portfolio';

    if (this.props.itemdata && this.props.itemdata.length > 1) {
      title += ' and Add Selected Products';
    }

    return (
      <Main title={ 'Add Portfolio' }>
        <div className="pf-l-stack">
          <div className="pf-l-stack__item pf-m-secondary ">
            <PageHeader>
              <PageHeaderTitle title= { title } />
            </PageHeader>
          </div>
          { /** why not use pf4 component? */ }
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

const mapStateToProps = state => ({ isLoading: state.PortfolioStore.isLoading });

const mapDispatchToProps = dispatch => bindActionCreators({
  addAlert,
  removeAlert,
  addPortfolio,
  fetchPortfolios
}, dispatch);

AddPortfolioModal.propTypes = {
  isLoading: propTypes.bool,
  addAlert: propTypes.func,
  fetchPortfolios: propTypes.func,
  addPortfolio: propTypes.func,
  closeModal: propTypes.func,
  itemdata: propTypes.object,
  history: propTypes.object
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AddPortfolioModal));
