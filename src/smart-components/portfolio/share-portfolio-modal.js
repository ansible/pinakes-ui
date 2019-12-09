import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import FormRenderer from '../common/form-renderer';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Modal, Title } from '@patternfly/react-core';
import { createPortfolioShareSchema } from '../../forms/portfolio-share-form.schema';
import { fetchPortfolios } from '../../redux/actions/portfolio-actions';
import { fetchShareInfo, sharePortfolio, unsharePortfolio } from '../../redux/actions/share-actions';
import { fetchRbacGroups } from '../../redux/actions/rbac-actions';
import { ShareLoader } from '../../presentational-components/shared/loader-placeholders';
import { permissionOptions, permissionValues } from '../../utilities/constants';
import { fetchFilterGroups } from '../../helpers/rbac/rbac-helper';

const SharePortfolioModal = ({
  history: { push },
  fetchPortfolios,
  initialValues,
  fetchShareInfo,
  sharePortfolio,
  fetchRbacGroups,
  shareInfo,
  portfolioId,
  rbacGroups,
  closeUrl
}) => {
  const [ isFetching, setFetching ] = useState(true);
  useEffect(() => {
    setFetching(true);
    Promise.all([ fetchShareInfo(portfolioId), fetchRbacGroups() ])
    .then(() => setFetching(false))
    .catch(() => setFetching(false));
  }, []);

  const initialShares = () => {
    let initialGroupShareList = shareInfo.map((group) => {
      const groupPermissions = group.permissions.filter((permission) => permissionValues.indexOf(permission) > -1);
      const groupName = group.group_name;
      let options = permissionOptions.find(perm => (perm.value === groupPermissions.sort().join(',')));
      return {
        [groupName]: options ? options.value : 'Unknown'
      };
    });
    let initialShareList = initialGroupShareList.reduce((acc, curr) => ({ ...acc, ...curr }), {});
    return initialShareList;
  };

  const loadGroupOptions = (inputValue) => fetchFilterGroups(inputValue);

  const onSubmit = data => {
    let sharePromises = [];
    if (data.group_uuid && data.permissions) {
      sharePromises.push(sharePortfolio(data));
    }

    shareInfo.forEach(share => {
      let initialPerm = share.permissions.sort().join(',');
      if (data[share.group_name] !== initialPerm) {
        if (!data[share.group_name]) {
          const sharePermissions = share.permissions.filter((permission) => permissionValues.indexOf(permission) > -1);
          sharePromises.push(unsharePortfolio({ id: portfolioId, permissions: sharePermissions, group_uuid: share.group_uuid }));
        }
        else {
          if (share.permissions.length > data[share.group_name].split(',').length) {
            sharePromises.push(unsharePortfolio({
              id: portfolioId,
              permissions: [ 'catalog:portfolios:update' ],
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
    push(closeUrl);

    return Promise.all(sharePromises).then(() => fetchPortfolios());
  };

  const onCancel = () => push(closeUrl);

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
      isSmall
      onClose={ onCancel }
    >
      { isFetching && <ShareLoader /> }
      { !isFetching && rbacGroups.length === 0 && (
        <Title headingLevel="h2" size="1xl">
            No groups available for sharing.
        </Title>) }
      { !isFetching && rbacGroups.length > 0 && (
        <FormRenderer
          schema={ createPortfolioShareSchema(shareItems(), loadGroupOptions, permissionOptions) }
          schemaType="default"
          onSubmit={ onSubmit }
          onCancel={ onCancel }
          initialValues={ { ...initialValues, ...initialShares() } }
          formContainer="modal"
          buttonsLabels={ { submitLabel: 'Send' } }
        />
      ) }
    </Modal>
  );
};

SharePortfolioModal.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
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
  initialValues: PropTypes.object,
  closeUrl: PropTypes.string.isRequired
};

const mapStateToProps = ({ rbacReducer: { rbacGroups },
  portfolioReducer: { portfolios },
  shareReducer: { shareInfo }},
{ match: { params: { id }}}) => ({
  initialValues: id && portfolios.data.find(item => item.id === id),
  portfolioId: id,
  shareInfo,
  rbacGroups
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchRbacGroups,
  fetchPortfolios,
  sharePortfolio,
  unsharePortfolio,
  fetchShareInfo
}, dispatch);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SharePortfolioModal));
