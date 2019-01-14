import React from 'react';
import PropTypes from 'prop-types';
import FormRenderer from '../Common/FormRenderer';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Modal } from '@patternfly/react-core';
import { addNotification } from '@red-hat-insights/insights-frontend-components/components/Notifications';
import { addPortfolio, fetchPortfoliosIfNeeded, updatePortfolio, fetchSelectedPortfolio } from '../../redux/Actions/PortfolioActions';
import { pipe } from 'rxjs';

const AddPortfolioModal = ({
  history: { goBack },
  addPortfolio,
  addNotification,
  fetchPortfoliosIfNeeded,
  portfolioId,
  initialValues,
  updatePortfolio,
  fetchSelectedPortfolio
}) => {
  const onSubmit = data => initialValues
    ? updatePortfolio(data).then(fetchSelectedPortfolio(portfolioId)).then(goBack)
    : addPortfolio(data).then(fetchPortfoliosIfNeeded()).then(goBack());

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

AddPortfolioModal.propTypes = {
  history: PropTypes.shape({
    goBack: PropTypes.func.isRequired
  }).isRequired,
  addPortfolio: PropTypes.func.isRequired,
  addNotification: PropTypes.func.isRequired,
  fetchPortfoliosIfNeeded: PropTypes.func.isRequired,
  initialValues: PropTypes.object,
  portfolioId: PropTypes.string,
  updatePortfolio: PropTypes.func.isRequired,
  fetchSelectedPortfolio: PropTypes.func.isRequired
};

const mapStateToProps = (state, { match: { params: { id }}}) => {
  // TODO fill initial values after hooks are available
  const initialvalues = {};
  return {
    initialValues: id && initialvalues,
    portfolioId: id
  };
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
  addNotification,
  addPortfolio,
  updatePortfolio,
  fetchPortfoliosIfNeeded,
  fetchSelectedPortfolio
}, dispatch);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AddPortfolioModal));
