import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import propTypes from 'prop-types';
import { Main, PageHeader, PageHeaderTitle } from '@red-hat-insights/insights-frontend-components';
import { addPortfolioWithItem, fetchPortfolios } from '../../Store/Actions/PortfolioActions';
import { PortfolioStore } from '../../Store/Reducers/PortfolioStore';
import { consoleLog } from '../../Helpers/Shared/Helper';
import { FormRenderer } from '@red-hat-insights/insights-frontend-components/components/Forms';
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
    componentDidMount() {
    };

  onSubmit = data => {
      this.props.addPortfolioWithItem(data, this.props.itemdata)
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
      consoleLog('Adding a New Portfolio');
      return (
          <Main title={ 'Add Portfolio' }>
              <div className="pf-l-stack">
                  <div className="pf-l-stack__item pf-m-secondary ">
                      <PageHeader>
                          <PageHeaderTitle title= 'Create Portfolio and Add Product' />
                      </PageHeader>
                  </div>
                  <div className="pf-l-stack">
                      <FormRenderer schema={ schema }
                          onSubmit={ this.onSubmit }
                          onCancel={ this.onCancel } />
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
    addPortfolioWithItem,
    fetchPortfolios
}, dispatch);

AddPortfolioModal.propTypes = {
    isLoading: propTypes.bool,
    history: propTypes.object,
    addAlert: propTypes.func,
    addPortfolioWithItem: propTypes.func,
    fetchPortfolios: propTypes.func,
    closeModal: propTypes.func,
    itemdata: propTypes.object
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AddPortfolioModal));
