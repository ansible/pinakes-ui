import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Modal, Button } from '@patternfly/react-core';
import { addNotification } from '@red-hat-insights/insights-frontend-components/components/Notifications';
import { removePortfolio, fetchPortfolios } from '../../redux/Actions/PortfolioActions';
import { pipe } from 'rxjs';

const RemovePortfolioModal = ({
  history: { goBack, push },
  removePortfolio,
  fetchPortfolios,
  addNotification,
  portfolioId,
  portfolioName
}) => {
  const onSubmit = () => removePortfolio(portfolioId)
  .then(() => pipe(push('/portfolios'), fetchPortfolios()));

  const onCancel = () => pipe(
    addNotification({
      variant: 'warning',
      title: 'Removing portfolio',
      description: 'Removing portfolio was cancelled by the user.'
    }),
    goBack()
  );

  return (
    <Modal
      title={ 'Remove portfolio' }
      isOpen
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
      Removing Portfolio { portfolioName }
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
  hideModal: PropTypes.func.isRequired,
  portfolioId: PropTypes.string,
  portfolioName: PropTypes.func.portfolioName,
  fetchPortfolios: PropTypes.func.isRequired
};

const mapStateToProps = ({ portfolioReducer: { selectedPortfolio }}) => ({
  portfolioId: selectedPortfolio.id,
  portfolioName: selectedPortfolio.name
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  addNotification,
  removePortfolio,
  fetchPortfolios
}, dispatch);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(RemovePortfolioModal));
