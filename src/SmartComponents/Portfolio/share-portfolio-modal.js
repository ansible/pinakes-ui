import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import FormRenderer from '../Common/FormRenderer';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Modal } from '@patternfly/react-core';
import { createPortfolioShareSchema } from '../../forms/portfolio-share-form.schema';
import { addNotification } from '@red-hat-insights/insights-frontend-components/components/Notifications';
import { fetchPortfolios, queryPortfolio, sharePortfolio, unsharePortfolio } from '../../redux/Actions/PortfolioActions';
import { fetchRbacGroups } from '../../redux/Actions/rbac-actions';
import GroupShareList from './Share/GroupShareList'
import { pipe } from 'rxjs';

// TODO - actual permission verbs
const permissionOptions = [{ value: 'catalog:portfolios:read,catalog:portfolios:order', label: 'Can order/edit' }, { value: 'catalog:portfolios:read,catalog:portfolios:write,catalog:portfolios:order', label: 'Can order/view'} ];
const groupsShareList = [{ id: 'uuid1', name: 'group_name1', permissions: { value: 'read,write,order', label: 'Can write/view'} },
                         { id: 'uuid2', name: 'group_name2', permissions: { value: 'read,order', label: 'Can order/view'} }];

const SharePortfolioModal = ({
  history: { goBack },
  addNotification,
  fetchPortfolios,
  initialValues,
  queryPortfolio,
  sharePortfolio,
  unsharePortfolio,
  fetchRbacGroups,
  rbacGroups
}) => {
  useEffect(() => {
    fetchRbacGroups();
  }, []);
  const onSubmit = data => sharePortfolio(data).then(goBack).then(() => fetchPortfolios());

  const onCancel = () => pipe(
    addNotification({
      variant: 'warning',
      title: 'Share portfolio',
      description: 'Share portfolio was cancelled by the user.'
    }),
    goBack()
  );

  let shareItems = {
    items: rbacGroups
  };

  return (
    <Modal
      title={ 'Share portfolio' }
      isOpen
      isLarge
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
          buttonsLabels={ { submitLabel: 'Send' } }
        />
        <GroupShareList { ...shareItems } noItems={ 'No Groups' }/>
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
  sharePortfolio: PropTypes.func.isRequired,
  unsharePortfolio: PropTypes.func.isRequired,
  queryPortfolio: PropTypes.func.isRequired,
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
  fetchRbacGroups,
  fetchPortfolios,
  sharePortfolio,
  unsharePortfolio,
  queryPortfolio
}, dispatch);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SharePortfolioModal));
