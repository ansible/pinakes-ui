import React, { Fragment, useContext } from 'react';
import { useIsApprovalAdmin } from '../../helpers/shared/approval-helpers';
import {
  TopToolbar,
  TopToolbarTitle
} from '../../presentational-components/shared/approval-top-toolbar';
import { AppTabs } from '../app-tabs/app-tabs';
import UserContext from '../../user-context';
import {
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStateSecondaryActions,
  Text,
  TextContent,
  TextVariants
} from '@patternfly/react-core';
import { useIntl } from 'react-intl';
import requestsMessages from '../../messages/requests.messages';
import commonMessages from '../../messages/common.message';
import { CubesIcon } from '@patternfly/react-icons';

const EmptyRequestList = () => {
  const { userRoles: userRoles } = useContext(UserContext);
  const isApprovalAdmin = useIsApprovalAdmin(userRoles);
  const intl = useIntl();
  return (
    <Fragment>
      <TopToolbar>
        <TopToolbarTitle
          title={intl.formatMessage(commonMessages.approvalTitle)}
        />
        {isApprovalAdmin && <AppTabs />}
      </TopToolbar>
      <EmptyState className="pf-u-ml-auto pf-u-mr-auto">
        <EmptyStateIcon icon={CubesIcon} />
        <TextContent>
          <Text component={TextVariants.h1}>
            {intl.formatMessage(requestsMessages.emptyRequestsTitle)}
          </Text>
        </TextContent>
        <EmptyStateBody>
          {intl.formatMessage(requestsMessages.emptyRequestsDescription)}
        </EmptyStateBody>
      </EmptyState>
      <EmptyStateSecondaryActions />
    </Fragment>
  );
};

export default EmptyRequestList;
