import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import propTypes from 'prop-types';
import { Stack, StackItem, Button} from '@patternfly/react-core';
import { Main, PageHeader, PageHeaderTitle } from '@red-hat-insights/insights-frontend-components';
import { addNotification } from '@red-hat-insights/insights-frontend-components/components/Notifications';
import { removePortfolio, fetchPortfolios } from '../../redux/Actions/PortfolioActions';

class RemovePortfolioModal extends Component {
  onSubmit = () => {
    this.props.removePortfolio(this.props.portfolio.id);
    this.props.closeModal();
  }

  onCancel = () => {
    this.props.addNotification({
      variant: 'warning',
      title: 'Removing portfolio',
      description: 'Removing portfolio was cancelled by the user.'
    });
    this.props.closeModal();
  }

  // Use pf4 components
  render() {
    return (
      <Main title={ 'Remove Portfolio' }>
        <Stack>
          <StackItem>
            <PageHeader>
              <PageHeaderTitle title= 'Remove Portfolio' />
            </PageHeader>
          </StackItem>
          <StackItem>
            <PageHeaderTitle>
              Remove Portfolio
            </PageHeaderTitle>
            <Button variant="primary" type="button" onClick={ this.onSubmit }>
              Remove
            </Button>
            <Button variant="primary" type="button" onClick={ this.onCancel }>
              Cancel
            </Button>
          </StackItem>
        </Stack>
      </Main>
    );
  }
}

const mapStateToProps = ({ portfolioReducer: { isLoading }}) => ({ isLoading });

const mapDispatchToProps = dispatch => bindActionCreators({
  addNotification,
  removePortfolio,
  fetchPortfolios
}, dispatch);

RemovePortfolioModal.propTypes = {
  isLoading: propTypes.bool,
  addNotification: propTypes.func,
  removePortfolio: propTypes.func,
  fetchPortfolios: propTypes.func,
  closeModal: propTypes.func,
  portfolio: propTypes.object
};

export default connect(mapStateToProps, mapDispatchToProps)(RemovePortfolioModal);
