import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import FormRenderer from '../Common/FormRenderer';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Modal } from '@patternfly/react-core';
import { createPortfolioShareSchema } from '../../forms/portfolio-share-form.schema';
import { addNotification } from '@red-hat-insights/insights-frontend-components/components/Notifications';
import { fetchPortfolios, fetchPortfolioSharing, updatePortfolioSharing } from '../../redux/Actions/PortfolioActions';
import { fetchRbacGroups } from '../../redux/Actions/rbac-actions';
import { pipe } from 'rxjs';

// TODO - actual permission verbs
const permissionOptions = [{ value: 'rx', label: 'Can order/edit' }, { value: 'rwx', label: 'Can order/view'} ];

const SharePortfolioModal = ({
  history: { goBack },
  fetchPortfolioSharing,
  addNotification,
  fetchPortfolios,
  initialValues,
  updatePortfolioSharing,
  fetchRbacGroups,
  rbacGroups
}) => {
  useEffect(() => {
    fetchRbacGroups();
  }, []);
  const onSubmit = data => initialValues
    ? updatePortfolio(data).then(goBack).then(() => fetchPortfolios())
    : addPortfolio(data).then(goBack).then(() => fetchPortfolios());

  const onCancel = () => pipe(
    addNotification({
      variant: 'warning',
      title: 'Share portfolio',
      description: 'Share portfolio was cancelled by the user.'
    }),
    goBack()
  );

  return (
    <Modal
      title={ 'Share portfolio' }
      isOpen
      style={ { maxWidth: 800 } }
      onClose={ onCancel }
    >
      <div style={ { padding: 8 } }>
        <FormRenderer
          schema={ createPortfolioShareSchema(rbacGroups, permissionOptions) }
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

SharePortfolioModal.propTypes = {
  history: PropTypes.shape({
    goBack: PropTypes.func.isRequired
  }).isRequired,
  //fetchPortfolioSharing: PropTypes.func.isRequired,
  addNotification: PropTypes.func.isRequired,
  fetchPortfolios: PropTypes.func.isRequired,
  fetchRbacGroups: PropTypes.func.isRequired,
//  updatePortfolioSharing: PropTypes.func.isRequired,
  rbacGroups: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]).isRequired,
    label: PropTypes.string.isRequired
  })).isRequired,
  initialValues: PropTypes.object
};

const mapStateToProps = ({ rbacReducer: { rbacGroups }, portfolioReducer: { portfolios }}, { match: { params: { id }}}) => ({
  initialValues: id && portfolios.find(item => item.id === id),
  portfolioId: id,
  rbacGroups
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  addNotification,
  //fetchPortfolioSharing,
  fetchRbacGroups,
  //updatePorfolioSharing,
  fetchPortfolios
}, dispatch);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SharePortfolioModal));
