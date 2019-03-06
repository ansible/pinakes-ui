import React from 'react';
import PropTypes from 'prop-types';
import FormRenderer from '../Common/FormRenderer';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Modal } from '@patternfly/react-core';
import { addNotification } from '@red-hat-insights/insights-frontend-components/components/Notifications';
import { fetchPortfolios, fetchPortfolioSharing, fetchGroups, updatePortfolioSharing } from '../../redux/Actions/PortfolioActions';
import { fetchGroups } from '../../redux/Actions/RbacActions';
import { pipe } from 'rxjs';

const SharePortfolioModal = ({
  history: { goBack },
  fetchPortfolioSharing,
  addNotification,
  fetchPortfolios,
  initialValues,
  fetchGroups,
  updatePortfolioSharing
}) => {
  const onSubmit = data => updatePortfolioSharing(data).then(goBack).then(() => fetchPortfolios());

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
      invite_group: { title: 'Invite Group', type: 'SELECT' },
      invited_groups: { title: 'Groups with access', type: 'SELECT' }
    },
    required: [ 'name', 'description' ]
  };

  return (
    <Modal
      title={ 'Share portfolio' }
      isOpen
      onClose={ onCancel }
    >
      <FormRenderer
        schema={ schema }
        schemaType="mozilla"
        onSubmit={ onSubmit }
        onCancel={ onCancel }
        initialValues={ { ...initialValues } }
        formContainer="modal"
        buttonsLabels={ {
          submitLabel: 'Send'
        } }
      />
    </Modal>
  );
};

SharePortfolioModal.propTypes = {
  history: PropTypes.shape({
    goBack: PropTypes.func.isRequired
  }).isRequired,
  fetchPortfolioSharing: PropTypes.func.isRequired,
  addNotification: PropTypes.func.isRequired,
  fetchPortfolios: PropTypes.func.isRequired,
  fetchGroups: PropTypes.func.isRequired,
  updatePortfolioSharing: PropTypes.func.isRequired,
  initialValues: PropTypes.object,
  updatePortfolio: PropTypes.func.isRequired
};

const mapStateToProps = ({ portfolioReducer: { portfolios }}, { match: { params: { id }}}) => ({
  initialValues: id && portfolios.find(item => item.id === id),
  portfolioId: id
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  addNotification,
  fetchPortfolioSharing,
  fetchGroups,
  updatePortfolioSharing,
  fetchPortfolios
}, dispatch);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SharePortfolioModal));
