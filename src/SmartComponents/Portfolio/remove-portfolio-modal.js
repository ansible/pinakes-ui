import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Modal, Button, Title, Bullseye } from '@patternfly/react-core';
import { addNotification } from '@red-hat-insights/insights-frontend-components/components/Notifications';
import { removePortfolio } from '../../redux/Actions/PortfolioActions';
import { hideModal } from '../../redux/Actions/MainModalActions';
import { pipe } from 'rxjs';
import './portfolio.scss';

const RemovePortfolioModal = ({
  history: { goBack, push },
  removePortfolio,
  addNotification,
  hideModal,
  portfolioId,
  portfolioName
}) => {
  const onSubmit = () => removePortfolio(portfolioId).then(hideModal()).then(push('/portfolios'));

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
      isOpen
      title = { '' }
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
      <Bullseye>
        <div className="center_message">
          <Title size={ '1xl' }>
            Removing Portfolio:  { portfolioName }
          </Title>
        </div>
      </Bullseye>
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
  portfolioName: PropTypes.func.portfolioName
};

const portfolioDetailsFromState = (state, id) => {
  return (state.portfolioReducer.portfolios.find(portfolio => portfolio.id  === id));
};

const mapStateToProps = (state, { match: { params: { id }}}) => {
  let portfolio = portfolioDetailsFromState(state, id);
  return {
    portfolioId: portfolio.id,
    portfolioName: portfolio.name
  };
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
  addNotification,
  removePortfolio,
  hideModal
}, dispatch);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(RemovePortfolioModal));
