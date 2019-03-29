import React, { useEffect } from 'react';
import { pipe } from 'rxjs';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import { Modal } from '@patternfly/react-core';
import { addNotification } from '@red-hat-insights/insights-frontend-components/components/Notifications';

import FormRenderer from '../common/form-renderer';
import { fetchWorkflows } from '../../redux/actions/approval-actions';
import { createPortfolioSchema } from '../../forms/portfolio-form.schema';
import { addPortfolio, fetchPortfolios, updatePortfolio } from '../../redux/actions/portfolio-actions';

const AddPortfolioModal = ({
  history: { goBack },
  addPortfolio,
  addNotification,
  fetchPortfolios,
  initialValues,
  updatePortfolio,
  fetchWorkflows,
  workflows
}) => {
  useEffect(() => {
    fetchWorkflows();
  }, []);
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

  return (
    <Modal
      title={ initialValues ? 'Edit portfolio' : 'Create portfolio' }
      isOpen
      onClose={ onCancel }
      isSmall
    >
      <div style={ { padding: 8 } }>
        <FormRenderer
          schema={ createPortfolioSchema(!initialValues, workflows) }
          schemaType="default"
          onSubmit={ onSubmit }
          onCancel={ onCancel }
          initialValues={ { ...initialValues } }
          formContainer="modal"
          buttonsLabels={ { submitLabel: 'Save' } }
        />
      </div>
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
  updatePortfolio: PropTypes.func.isRequired,
  fetchWorkflows: PropTypes.func.isRequired,
  workflows: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]).isRequired,
    label: PropTypes.string.isRequired
  })).isRequired
};

const mapStateToProps = ({ approvalReducer: { workflows }, portfolioReducer: { portfolios }}, { match: { params: { id }}}) => ({
  initialValues: id && portfolios.find(item => item.id === id),
  portfolioId: id,
  workflows
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  addNotification,
  addPortfolio,
  updatePortfolio,
  fetchPortfolios,
  fetchWorkflows
}, dispatch);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AddPortfolioModal));
