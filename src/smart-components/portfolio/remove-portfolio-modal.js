import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Modal, Button } from '@patternfly/react-core';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications';
import { removePortfolio } from '../../redux/actions/portfolio-actions';

const RemovePortfolioModal = ({
  history: { goBack, push },
  removePortfolio,
  portfolio
}) => {
  const onSubmit = () => {
    push('/portfolios');
    return removePortfolio(portfolio.id);
  };

  const onCancel = () => goBack();

  if (!portfolio) {
    return null;
  }

  return (
    <Modal
      title={ `Removing Portfolio:  ${ portfolio.name }` }
      isOpen
      isSmall
      onClose={ onCancel }
      actions={ [
        <Button key="cancel" variant="secondary" type="button" onClick={ onCancel }>
          Cancel
        </Button>,
        <Button key="submit" variant="primary" type="button" onClick={ onSubmit }>
          Confirm
        </Button>
      ] }
    >
    </Modal>
  );
};

RemovePortfolioModal.propTypes = {
  history: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired
  }).isRequired,
  removePortfolio: PropTypes.func.isRequired,
  addNotification: PropTypes.func.isRequired,
  portfolio: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
  })
};

const portfolioDetailsFromState = (state, id) =>
  state.portfolioReducer.portfolios.data.find(portfolio => portfolio.id  === id);

const mapStateToProps = (state, { match: { params: { id }}}) => ({ portfolio: portfolioDetailsFromState(state, id) });

const mapDispatchToProps = (dispatch) => bindActionCreators({
  addNotification,
  removePortfolio
}, dispatch);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(RemovePortfolioModal));
