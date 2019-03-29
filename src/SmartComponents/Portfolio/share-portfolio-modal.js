import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import FormRenderer from '../Common/FormRenderer';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Modal } from '@patternfly/react-core';
import { createPortfolioShareSchema } from '../../forms/portfolio-share-form.schema';
import { addNotification } from '@red-hat-insights/insights-frontend-components/components/Notifications';
import { fetchPortfolios } from '../../redux/Actions/PortfolioActions';
import { fetchShareInfo, sharePortfolio, unsharePortfolio } from '../../redux/Actions/share-actions';
import { fetchRbacGroups } from '../../redux/Actions/rbac-actions';
import { pipe } from 'rxjs';

const SharePortfolioModal = ({
  history: { goBack },
  isLoading,
  addNotification,
  fetchPortfolios,
  initialValues,
  fetchShareInfo,
  sharePortfolio,
  fetchRbacGroups,
  shareInfo,
  portfolioId,
  rbacGroups
}) => {
  useEffect(() => {
    fetchShareInfo(portfolioId);
    fetchRbacGroups();
  }, []);

  useEffect(() => {
    setInitialSharesList(shareInfo);
  }, [ isLoading ]);

  const [ initialSharesList, setInitialSharesList ] = useState();

  const onSubmit = data =>
  {
    console.log( 'InitialShareList', initialSharesList );
    console.log( 'shareInfo', shareInfo );
    console.log( 'OnSubmit data', data);
    console.log( 'rbacGroups', rbacGroups );
    sharePortfolio(data).then(goBack).then(() => fetchPortfolios());
  }

  const onCancel = () => pipe(
    addNotification({
      variant: 'warning',
      title: 'Share portfolio',
      description: 'Share portfolio was cancelled by the user.'
    }),
    goBack()
  );

  const permissionOptions = [{ value: 'catalog:portfolios:read,catalog:portfolios:order', label: 'Can order/edit' },
    { value: 'catalog:portfolios:read,catalog:portfolios:write,catalog:portfolios:order', label: 'Can order/view' }];

  const shareItems = () => {
    let groupsWithNoSharing = rbacGroups;
    return { groups: groupsWithNoSharing,
      items: shareInfo
    };
  };

  const initialShares = () => {
    let initialGroupShareList = shareInfo.map((group) => { const groupName = group.group_name;
      return { [groupName]: (permissionOptions.find(perm => (perm.value === group.permissions.join(',')))) };});
    console.log('initialGroupShareList', initialGroupShareList);
    return initialGroupShareList.reduce((acc, curr) => ({ ...acc, ...curr }), {});
  };

  return (
    <Modal
      title={ 'Share portfolio' }
      isOpen
      isLarge
      onClose={ onCancel }
    >
      <div style={ { padding: 8 } }>
        { (!isLoading && rbacGroups.length > 0) &&
        <FormRenderer
          schema={ createPortfolioShareSchema(shareItems(), permissionOptions) }
          schemaType="default"
          onSubmit={ onSubmit }
          onCancel={ onCancel }
          initialValues={ { ...initialValues, ...initialShares() } }
          formContainer="modal"
          buttonsLabels={ { submitLabel: 'Send' } }
        />
        }
      </div>
    </Modal>
  );
};

SharePortfolioModal.propTypes = {
  history: PropTypes.shape({
    goBack: PropTypes.func.isRequired
  }).isRequired,
  isLoading: PropTypes.bool,
  addNotification: PropTypes.func.isRequired,
  fetchPortfolios: PropTypes.func.isRequired,
  fetchRbacGroups: PropTypes.func.isRequired,
  sharePortfolio: PropTypes.func.isRequired,
  unsharePortfolio: PropTypes.func.isRequired,
  fetchShareInfo: PropTypes.func.isRequired,
  portfolioId: PropTypes.string.isRequired,
  shareInfo: PropTypes.array.isRequired,
  rbacGroups: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]).isRequired,
    label: PropTypes.string.isRequired
  })).isRequired,
  initialValues: PropTypes.object
};

const mapStateToProps = ({ rbacReducer: { rbacGroups },
  portfolioReducer: { portfolios },
  shareReducer: { shareInfo, isLoading }},
{ match: { params: { id }}}) => ({
  initialValues: id && portfolios.find(item => item.id === id),
  portfolioId: id,
  isLoading,
  shareInfo,
  rbacGroups
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  addNotification,
  fetchRbacGroups,
  fetchPortfolios,
  sharePortfolio,
  unsharePortfolio,
  fetchShareInfo
}, dispatch);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SharePortfolioModal));
