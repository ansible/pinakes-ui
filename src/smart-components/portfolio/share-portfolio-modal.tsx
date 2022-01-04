/* eslint-disable react/prop-types */
import React, { ReactNode, useEffect, useState } from 'react';
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
import {
  fetchPortfolios,
  resetSelectedPortfolio
} from '../../redux/actions/portfolio-actions';
import {
  fetchShareInfo,
  sharePortfolio,
  unsharePortfolio
} from '../../redux/actions/share-actions';
import { ShareLoader } from '../../presentational-components/shared/loader-placeholders';
import { permissionOptions, permissionValues } from '../../utilities/constants';
import { fetchFilterGroups } from '../../helpers/rbac/rbac-helper';
import { fetchFilterGroups as fetchFilterGroupsS } from '../../helpers/rbac/rbac-helper-s';
import useQuery from '../../utilities/use-query';
import useEnhancedHistory from '../../utilities/use-enhanced-history';
import { UnauthorizedRedirect } from '../error-pages/error-redirects';
import portfolioMessages from '../../messages/portfolio.messages';
import { ADD_NOTIFICATION } from '@redhat-cloud-services/frontend-components-notifications/redux';
import filteringMessages from '../../messages/filtering.messages';
import useFormatMessage from '../../utilities/use-format-message';
import sharePorfolioMessage, {
  SharePortfolioData
} from '../../helpers/portfolio/share-portfolio-message';
import { CatalogRootState } from '../../types/redux';
import {
  ShareInfo,
  SharePolicyPermissionsEnum,
  UnsharePolicyPermissionsEnum
} from '@redhat-cloud-services/catalog-client';
import { FormApi, Full, InternalPortfolio } from '../../types/common-types';

export type UniversalSharePolicy =
  | (UnsharePolicyPermissionsEnum[] & SharePolicyPermissionsEnum.Read)
  | (UnsharePolicyPermissionsEnum[] & SharePolicyPermissionsEnum.Update)
  | (UnsharePolicyPermissionsEnum[] & SharePolicyPermissionsEnum.Delete)
  | (UnsharePolicyPermissionsEnum[] & SharePolicyPermissionsEnum.Order);

export interface SharePortfolioModalProps {
  closeUrl: string;
  removeSearch?: boolean;
  portfolioName?: (portfolio: string) => string | undefined;
  viewState?: {
    count: number;
    limit: number;
    offset: number;
    filter: string;
  };
}
const SharePortfolioModal: React.ComponentType<SharePortfolioModalProps> = ({
  closeUrl,
  removeSearch,
  viewState,
  portfolioName = () => ''
}) => {
  const formatMessage = useFormatMessage();
  const dispatch = useDispatch();
  const { push } = useEnhancedHistory({ removeSearch, keepHash: true });
  const [{ portfolio }, search] = useQuery(['portfolio']);
  const [isFetching, setFetching] = useState(true);

  const { selectedPortfolio: initialValues, isLoading } = useSelector<
    CatalogRootState,
    {
      selectedPortfolio: InternalPortfolio;
      isLoading: boolean;
    }
  >(({ portfolioReducer: { selectedPortfolio, isLoading } }) => ({
    selectedPortfolio: selectedPortfolio as InternalPortfolio,
    isLoading
  }));

  const { shareInfo } = useSelector<
    CatalogRootState,
    {
      shareInfo: ShareInfo[];
    }
  >(({ shareReducer: { shareInfo } }) => ({
    shareInfo
  }));
  useEffect(() => {
    setFetching(true);
    dispatch(fetchShareInfo(portfolio) as Promise<any>)
      .then(() => setFetching(false))
      .catch(() => setFetching(false));
  }, []);

  const onCancel = () => {
    dispatch(resetSelectedPortfolio());
    push({ pathname: closeUrl, search });
  };

  const initialShares = () => {
    const initialGroupShareList = (shareInfo as Full<ShareInfo>[]).map(
      (group) => {
        const groupPermissions = group.permissions.filter(
          (permission) => permissionValues.indexOf(permission) > -1
        );
        const groupName = group.group_name;
        const options = permissionOptions.find(
          (perm) => perm.value === groupPermissions.sort().join(',')
        );
        return {
          groupName,
          group_uuid: group.group_uuid,
          permissions: options
            ? options.value
            : formatMessage(filteringMessages.unknown)
        };
      }
    );
    return initialGroupShareList;
  };

  const loadGroupOptions = (inputValue?: string) =>
    localStorage.getItem('catalog_standalone')
      ? fetchFilterGroupsS(inputValue)
      : fetchFilterGroups(inputValue);

  const onSubmit = (
    data: { 'shared-groups': SharePortfolioData[] },
    formApi: FormApi
  ) => {
    const shareData = data['shared-groups'];
    const newGroups: SharePortfolioData[] = [];
    const initialGroups: SharePortfolioData[] = formApi.getState()
      .initialValues['shared-groups'];
    console.log('Debug onSubmit: initialGroups', initialGroups);
    console.log('Debug onSubmit: shareData', shareData);
    const removedGroups = initialGroups
      .filter(
        (group) =>
          !shareData.find((item) => item.group_uuid === group.group_uuid)
      )
      .map(({ permissions, ...group }) => ({
        ...group,
        permissions: permissions.split(',')
      }));
    console.log('Debug onSubmit: removedGroups', removedGroups);
    shareData.forEach((group) => {
      const initialEntry = initialGroups.find(
        (item) => item.group_uuid === group.group_uuid
      );
      if (initialEntry && !isEqual(initialEntry, group)) {
        if (initialEntry.permissions!.length > group.permissions.length) {
          removedGroups.push({
            id: portfolio,
            permissions: ['update'],
            group_uuid: group.group_uuid,
            groupName: group.groupName
          });
        } else {
          newGroups.push(group);
        }
      }

      if (!initialEntry) {
        newGroups.push(group);
      }
    });
    console.log('Debug onSubmit: newGroups', newGroups);
    const createSharePromise = (group: SharePortfolioData, unshare = false) => {
      const action = unshare ? unsharePortfolio : sharePortfolio;
      return dispatch(
        action({
          id: portfolio,
          permissions: (group.permissions as unknown) as UniversalSharePolicy,
          group_uuid: group.group_uuid
        })
      );
    };

    const sharePromises = [
      ...newGroups.map((group) => createSharePromise(group)),
      ...removedGroups.map((group) =>
        createSharePromise((group as unknown) as Full<SharePortfolioData>, true)
      )
    ];

    onCancel();

    const { title, description } = sharePorfolioMessage({
      shareData,
      initialGroups,
      removedGroups: removedGroups.map(({ permissions, ...rest }) => ({
        ...rest,
        permissions: permissions.join(',')
      })),
      newGroups,
      formatMessage,
      portfolioName
    });

    return Promise.all(sharePromises).then(() => {
      dispatch({
        type: ADD_NOTIFICATION,
        payload: {
          dismissable: true,
          variant: 'success',
          title,
          description
        }
      });
      return dispatch(fetchPortfolios(viewState));
    });
  };

  if (
    initialValues?.metadata?.user_capabilities?.share === false &&
    initialValues?.metadata?.user_capabilities?.unshare === false
  ) {
    return <UnauthorizedRedirect />;
  }

  const validateShares = (values: {
    group_uuid?: string;
    permissions?: string[];
  }) => {
    const errors: {
      permissions?: ReactNode;
      group_uuid?: ReactNode;
    } = {};
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

  const isLoadingFinal = isFetching || isLoading;

  return (
    <Modal
      title={formatMessage(portfolioMessages.portfolioShareTitle) as string}
      isOpen
      variant="small"
      onClose={onCancel}
    >
      {isLoadingFinal && <ShareLoader />}
      {!isLoadingFinal && (
        <Stack hasGutter>
          <StackItem>
            <TextContent>
              <Text>
                {formatMessage(portfolioMessages.portfolioShareDescription, {
                  name: portfolioName(portfolio),
                  // eslint-disable-next-line react/display-name
                  strong: (chunks: ReactNode) => (
                    <strong key="strong">{chunks}</strong>
                  )
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
              onSubmit={onSubmit}
              onCancel={onCancel}
              validate={validateShares}
              initialValues={{
                ...initialValues,
                'shared-groups': initialShares()
              }}
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

export default SharePortfolioModal;
