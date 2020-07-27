import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import FormRenderer from '../common/form-renderer';
import { useDispatch, useSelector } from 'react-redux';
import isEqual from 'lodash/isEqual';
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
import { useIntl } from 'react-intl';
import portfolioMessages from '../../messages/portfolio.messages';
import { ADD_NOTIFICATION } from '@redhat-cloud-services/frontend-components-notifications/cjs/actionTypes';
import commonMessages from '../../messages/common.message';

const SharePortfolioModal = ({
  closeUrl,
  removeQuery,
  viewState,
  portfolioName = () => ''
}) => {
  const { formatMessage } = useIntl();
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
        groupName,
        group_uuid: group.group_uuid,
        permissions: options
          ? options.value
          : formatMessage(commonMessages.unknown)
      };
    });
    return initialGroupShareList;
  };

  const loadGroupOptions = (inputValue) => fetchFilterGroups(inputValue);

  const onSubmit = (data, formApi) => {
    const shareData = data['shared-groups'];
    const newGroups = [];
    const initialGroups = formApi.getState().initialValues['shared-groups'];
    const removedGroups = initialGroups
      .filter(
        (group) =>
          !shareData.find((item) => item.group_uuid === group.group_uuid)
      )
      .map(({ permissions, ...group }) => ({
        ...group,
        permissions: permissions.split(',')
      }));
    shareData.forEach((group) => {
      const initialEntry = initialGroups.find(
        (item) => item.group_uuid === group.group_uuid
      );
      if (initialEntry && !isEqual(initialEntry, group)) {
        if (initialEntry.permissions.length > group.permissions.length) {
          removedGroups.push({
            id: portfolio,
            permissions: ['update'],
            group_uuid: group.group_uuid
          });
        } else {
          newGroups.push(group);
        }
      }

      if (!initialEntry) {
        newGroups.push(group);
      }
    });

    const createSharePromise = (group, unshare = false) => {
      const action = unshare ? unsharePortfolio : sharePortfolio;
      return dispatch(
        action({
          id: portfolio,
          permissions: group.permissions,
          group_uuid: group.group_uuid
        })
      );
    };

    const sharePromises = [
      ...newGroups.map((group) => createSharePromise(group)),
      ...removedGroups.map((group) => createSharePromise(group, true))
    ];

    push({ pathname: closeUrl, search });

    return Promise.all(sharePromises).then(() => {
      dispatch({
        type: ADD_NOTIFICATION,
        payload: {
          dismissable: true,
          variant: 'success',
          title: formatMessage(portfolioMessages.shareSuccessTitle)
        }
      });
      return dispatch(fetchPortfolios(viewState));
    });
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
      errors.permissions = formatMessage(
        portfolioMessages.portfolioSharePermissions
      );
    }

    if (values.permissions && !values.group_uuid) {
      errors.group_uuid = formatMessage(portfolioMessages.portfolioShareGroups);
    }

    return errors;
  };

  return (
    <Modal
      title={formatMessage(portfolioMessages.portfolioShareTitle)}
      isOpen
      variant="small"
      onClose={onCancel}
    >
      {isFetching && <ShareLoader />}
      {!isFetching && (
        <Stack hasGutter>
          <StackItem>
            <TextContent>
              <Text>
                {formatMessage(portfolioMessages.portfolioShareDescription, {
                  name: portfolioName(portfolio),
                  // eslint-disable-next-line react/display-name
                  strong: (chunks) => <strong key="strong">{chunks}</strong>
                })}
              </Text>
            </TextContent>
          </StackItem>
          <StackItem>
            <FormRenderer
              schema={createPortfolioShareSchema(
                loadGroupOptions,
                permissionOptions,
                initialValues?.metadata?.user_capabilities?.share !== false,
                initialValues?.metadata?.user_capabilities?.unshare !== false
              )}
              schemaType="default"
              onSubmit={onSubmit}
              onCancel={onCancel}
              validate={validateShares}
              initialValues={{
                ...initialValues,
                'shared-groups': initialShares()
              }}
              formContainer="modal"
              templateProps={{
                disableSubmit: ['pristine', 'validating'],
                submitLabel: formatMessage(
                  portfolioMessages.portfolioShareApply
                )
              }}
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
