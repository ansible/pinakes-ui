import React from 'react';
import PropTypes from 'prop-types';
import FormRenderer from '../Common/FormRenderer';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Modal } from '@patternfly/react-core';
import { addNotification } from '@red-hat-insights/insights-frontend-components/components/Notifications';
import { fetchSelectedPortfolio } from '../../redux/Actions/PortfolioActions';
import { fetchServicePlans, sendSubmitOrder } from '../../redux/Actions/OrderActions';
import { pipe } from 'rxjs';

const OrderPortfolioModal = ({
  history: { goBack },
  addNotification,
  portfolioId,
  initialValues,
  sendSubmitOrder,
  fetchServicePlans
}) => {
  const onSubmit = data => sendSubmitOrder(data).then(goBack());

  const onCancel = () => pipe(
    addNotification({
      variant: 'warning',
      title: initialValues ? 'Editing portfolio' : 'Adding portfolio',
      description: initialValues ? 'Edit portfolio was cancelled by the user.' : 'Adding portfolio was cancelled by the user.'
    }),
    goBack()
  );

  const schema = {
    type: 'object',
    properties: {
      name: { title: initialValues ? 'Portfolio Name' : 'New Portfolio Name', type: 'string' },
      description: { title: 'Description', type: 'string' }
    },
    required: [ 'name', 'description' ]
  };

  return (
    <Modal
      title={ initialValues ? 'Edit portfolio' : 'Add portfolio' }
      isOpen
      onClose={ onCancel }
    >
      <FormRenderer
        schema={ schema }
        schemaType="mozilla"
        onSubmit={ onSubmit }
        onCancel={ onCancel }
        initialValues={ { ...initialValues } }
      />
    </Modal>
  );
};

OrderPortfolioModal.propTypes = {
  history: PropTypes.shape({
    goBack: PropTypes.func.isRequired
  }).isRequired,
  sendSubmitOrder: PropTypes.func.isRequired,
  addNotification: PropTypes.func.isRequired,
  initialValues: PropTypes.object,
  portfolioId: PropTypes.string,
  fetchServicePlans: PropTypes.func.isRequired,
  fetchSelectedPortfolio: PropTypes.func.isRequired
};

const mapStateToProps = (state, { match: { params: { id }}}) => ({
  initialValues: id && state.PortfolioReducer.portfolios.find(item => item.id === id),
  portfolioId: id
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  addNotification,
  sendSubmitOrder,
  fetchServicePlans,
  fetchSelectedPortfolio
}, dispatch);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(OrderPortfolioModal));
