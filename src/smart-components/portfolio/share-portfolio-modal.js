import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import FormRenderer from '../common/form-renderer';
import { useDispatch, useSelector } from 'react-redux';
import {
  Modal,
  TextContent,
  Text,
  Stack,
  StackItem
} from '@patternfly/react-core';
import { createPortfolioShareSchema } from '../../forms/portfolio-share-form.schema';
import { fetchPortfolios } from '../../redux/actions/portfolio-actions';
import {
  fetchShareInfo,
  sharePortfolio,
  unsharePortfolio
} from '../../redux/actions/share-actions';
import { ShareLoader } from '../../presentational-components/shared/loader-placeholders';
import { permissionOptions, permissionValues } from '../../utilities/constants';
import { fetchFilterGroups } from '../../helpers/rbac/rbac-helper';
import useQuery from '../../utilities/use-query';
import useEnhancedHistory from '../../utilities/use-enhanced-history';
import { UnauthorizedRedirect } from '../error-pages/error-redirects';

const SharePortfolioModal = ({
  closeUrl,
  removeQuery,
  viewState,
  portfolioName = () => ''
}) => {
  const dispatch = useDispatch();
  const { push } = useEnhancedHistory({ removeQuery, keepHash: true });
  const [{ portfolio }, search] = useQuery(['portfolio']);
  const [isFetching, setFetching] = useState(true);
  const initialValues = useSelector(
    ({ portfolioReducer: { selectedPortfolio } }) => selectedPortfolio
  );
  const { shareInfo } = useSelector(({ shareReducer: { shareInfo } }) => ({
    shareInfo
  }));
  useEffect(() => {
    setFetching(true);
    dispatch(fetchShareInfo(portfolio))
      .then(() => setFetching(false))
      .catch(() => setFetching(false));
  }, []);

  const initialShares = () => {
    let initialGroupShareList = shareInfo.map((group) => {
      const groupPermissions = group.permissions.filter(
        (permission) => permissionValues.indexOf(permission) > -1
      );
      const groupName = group.group_name;
      let options = permissionOptions.find(
        (perm) => perm.value === groupPermissions.sort().join(',')
      );
      return {
        [groupName]: options ? options.value : 'Unknown'
      };
    });
    let initialShareList = initialGroupShareList.reduce(
      (acc, curr) => ({ ...acc, ...curr }),
      {}
    );
    return initialShareList;
  };

  const loadGroupOptions = (inputValue) => fetchFilterGroups(inputValue);

  const onSubmit = (data) => {
    let sharePromises = [];
    if (data.group_uuid && data.permissions) {
      sharePromises.push(dispatch(sharePortfolio({ id: portfolio, ...data })));
    }

    shareInfo.forEach((share) => {
      let initialPerm = share.permissions.sort().join(',');
      if (data[share.group_name] !== initialPerm) {
        if (!data[share.group_name]) {
          const sharePermissions = share.permissions.filter(
            (permission) => permissionValues.indexOf(permission) > -1
          );
          sharePromises.push(
            dispatch(
              unsharePortfolio({
                id: portfolio,
                permissions: sharePermissions,
                group_uuid: share.group_uuid
              })
            )
          );
        } else {
          if (
            share.permissions.length > data[share.group_name].split(',').length
          ) {
            sharePromises.push(
              dispatch(
                unsharePortfolio({
                  id: portfolio,
                  permissions: ['update'],
                  group_uuid: share.group_uuid
                })
              )
            );
          } else {
            sharePromises.push(
              dispatch(
                sharePortfolio({
                  id: portfolio,
                  permissions: data[share.group_name],
                  group_uuid: share.group_uuid
                })
              )
            );
          }
        }
      }
    });
    push({ pathname: closeUrl, search });

    return Promise.all(sharePromises).then(() =>
      dispatch(fetchPortfolios(viewState))
    );
  };

  const onCancel = () => push({ pathname: closeUrl, search });

  if (
    initialValues?.metadata?.user_capabilities?.share === false &&
    initialValues?.metadata?.user_capabilities?.unshare === false
  ) {
    return <UnauthorizedRedirect />;
  }

  const validateShares = (values) => {
    const errors = {};
    if (values.group_uuid && !values.permissions) {
      errors.permissions = 'Select the share permissions';
    }

    if (values.permissions && !values.group_uuid) {
      errors.group_uuid = 'Select a group';
    }

    return errors;
  };

  return (
    <Modal title="Share portfolio" isOpen variant="small" onClose={onCancel}>
      {isFetching && <ShareLoader />}
      {!isFetching && (
        <Stack hasGutter>
          <StackItem>
            <TextContent>
              <Text>
                Share <strong>{portfolioName(portfolio)}</strong> portfolio
              </Text>
            </TextContent>
          </StackItem>
          <StackItem>
            <FormRenderer
              schema={createPortfolioShareSchema(
                shareInfo,
                loadGroupOptions,
                permissionOptions,
                initialValues?.metadata?.user_capabilities?.share !== false,
                initialValues?.metadata?.user_capabilities?.unshare !== false
              )}
              schemaType="default"
              onSubmit={onSubmit}
              onCancel={onCancel}
              validate={validateShares}
              initialValues={{ ...initialValues, ...initialShares() }}
              formContainer="modal"
              buttonsLabels={{ submitLabel: 'Apply' }}
            />
          </StackItem>
        </Stack>
      )}
    </Modal>
  );
};

SharePortfolioModal.propTypes = {
  closeUrl: PropTypes.string.isRequired,
  removeQuery: PropTypes.bool,
  portfolioName: PropTypes.func,
  viewState: PropTypes.shape({
    count: PropTypes.number,
    limit: PropTypes.number,
    offset: PropTypes.number,
    filter: PropTypes.string
  })
};

export default SharePortfolioModal;
