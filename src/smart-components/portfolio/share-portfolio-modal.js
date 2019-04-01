import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import FormRenderer from '../common/form-renderer';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Modal } from '@patternfly/react-core';
import { createPortfolioShareSchema } from '../../forms/portfolio-share-form.schema';
import { addNotification } from '@red-hat-insights/insights-frontend-components/components/Notifications';
import { fetchPortfolios } from '../../redux/actions/portfolio-actions';
import { fetchShareInfo, sharePortfolio, unsharePortfolio } from '../../redux/actions/share-actions';
import { fetchRbacGroups } from '../../redux/actions/rbac-actions';
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

  const initialShares = () => {
    let initialGroupShareList = shareInfo.map((group) => { const groupName = group.group_name;
      let options = permissionOptions.find(perm => (perm.value === group.permissions.sort().join(',')));
      return { [groupName]: options ? options.value : 'Unknown' };});
    let initialShareList = initialGroupShareList.reduce((acc, curr) => ({ ...acc, ...curr }), {});

    return initialShareList;
  };

  const onSubmit = data =>
  {
    let sharePromises = [];
    if (data.group_uuid && data.permissions) {
      sharePromises.push(sharePortfolio(data));
    }

    shareInfo.map(share => {
      let initialPerm = share.permissions.sort().join(',');
      if (data[share.group_name] !== initialPerm) {
        if (!data[share.group_name]) {
          sharePromises.push(unsharePortfolio({ id: portfolioId, permissions: share.permissions, group_uuid: share.group_uuid }));
        }
        else {
          if (share.permissions.length > data[share.group_name].split(',').length) {
            sharePromises.push(unsharePortfolio({
              id: portfolioId,
              permissions: [ 'catalog:portfolios:write' ],
              group_uuid: share.group_uuid
            }));
          }
          else {
            sharePromises.push(sharePortfolio({
              id: portfolioId,
              permissions: data[share.group_name],
              group_uuid: share.group_uuid
            }));
          }
        }
      }
    });

    Promise.all(sharePromises).then(goBack).then(() => fetchPortfolios());
  };

  const onCancel = () => pipe(
    addNotification({
      variant: 'warning',
      title: 'Share portfolio',
      description: 'Share portfolio was cancelled by the user.'
    }),
    goBack()
  );

  const permissionOptions = [{ value: 'catalog:portfolios:order,catalog:portfolios:read,catalog:portfolios:write',
    label: 'Can order/edit' },
  { value: 'catalog:portfolios:order,catalog:portfolios:read', label: 'Can order/view' }];

  const shareItems = () => {
    let groupsWithNoSharing = rbacGroups.filter((item) => {
      return !shareInfo.find(shareGroup => shareGroup.group_uuid === item.value);});
    return { groups: groupsWithNoSharing,
      items: shareInfo
    };
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
