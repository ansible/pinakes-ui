import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Modal, Button, Bullseye, Text, TextContent, TextVariants } from '@patternfly/react-core';
import { addNotification } from '@red-hat-insights/insights-frontend-components/components/Notifications';
import { fetchPortfolios, removePortfolio } from '../../redux/Actions/PortfolioActions';
import { pipe } from 'rxjs';

const RemovePortfolioModal = ({
  history: { goBack, push },
  removePortfolio,
  addNotification,
  fetchPortfolios,
  portfolio
}) => {
  const onSubmit = () => removePortfolio(portfolio.id)
  .then(() => pipe(fetchPortfolios(), push('/portfolios')));

  const onCancel = () => pipe(
    addNotification({
      variant: 'warning',
      title: 'Removing portfolio',
      description: 'Removing portfolio was cancelled by the user.'
    }),
    goBack()
  );

  if (!portfolio) {
    return null;
  }

  return (
    <Modal
      title=" "
      isOpen
      isSmall
      hideTitle
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
        <TextContent>
          <Text component={ TextVariants.h1 }>
            Removing Portfolio:  { portfolio.name }
          </Text>
        </TextContent>
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
  fetchPortfolios: PropTypes.func.isRequired,
  portfolio: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
  })
};

const portfolioDetailsFromState = (state, id) =>
  state.portfolioReducer.portfolios.find(portfolio => portfolio.id  === id);

const mapStateToProps = (state, { match: { params: { id }}}) => ({ portfolio: portfolioDetailsFromState(state, id) });

const mapDispatchToProps = (dispatch) => bindActionCreators({
  addNotification,
  fetchPortfolios,
  removePortfolio
}, dispatch);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(RemovePortfolioModal));
