import React from 'react';
import PropTypes from 'prop-types';
import FormRenderer from '../Common/FormRenderer';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Modal } from '@patternfly/react-core';
import { addNotification } from '@red-hat-insights/insights-frontend-components/components/Notifications';
import { addPortfolio, fetchPortfolios, updatePortfolio } from '../../redux/Actions/PortfolioActions';
import { pipe } from 'rxjs';

const AddPortfolioModal = ({
  history: { goBack },
  addPortfolio,
  addNotification,
  fetchPortfolios,
  initialValues,
  updatePortfolio
}) => {
  const onSubmit = data => initialValues
    ? updatePortfolio(data).then(goBack).then(() => fetchPortfolios())
    : addPortfolio(data).then(goBack).then(() => fetchPortfolios());

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
      title={ initialValues ? 'Edit portfolio' : 'Create portfolio' }
      isOpen
      onClose={ onCancel }
    >
      <FormRenderer
        schema={ schema }
        schemaType="mozilla"
        onSubmit={ onSubmit }
        onCancel={ onCancel }
        initialValues={ { ...initialValues } }
        buttonsLabels={ {
          submitLabel: 'Save'
        } }
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
  fetchPortfolios: PropTypes.func.isRequired,
  initialValues: PropTypes.object,
  updatePortfolio: PropTypes.func.isRequired
};

const mapStateToProps = ({ portfolioReducer: { portfolios }}, { match: { params: { id }}}) => ({
  initialValues: id && portfolios.find(item => item.id === id),
  portfolioId: id
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  addNotification,
  addPortfolio,
  updatePortfolio,
  fetchPortfolios
}, dispatch);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AddPortfolioModal));
