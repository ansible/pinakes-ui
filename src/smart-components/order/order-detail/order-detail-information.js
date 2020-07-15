import React from 'react';
import PropTypes from 'prop-types';
import {
  Split,
  SplitItem,
  LevelItem,
  Level,
  Title,
  TextContent,
  Text,
  TextVariants
} from '@patternfly/react-core';
import { ExclamationCircleIcon } from '@patternfly/react-icons';
import { DateFormat } from '@redhat-cloud-services/frontend-components/components/cjs/DateFormat';

import CardIcon from '../../../presentational-components/shared/card-icon';
import { CATALOG_API_BASE } from '../../../utilities/constants';
import { useIntl } from 'react-intl';
import statesMessages from '../../../messages/states.messages';
import ordersMessages from '../../../messages/orders.messages';

const OrderDetailInformation = ({
  jobName,
  state,
  orderRequestDate,
  orderUpdateDate,
  owner,
  portfolioItemId,
  sourceId
}) => {
  const { formatMessage } = useIntl();
  return (
    <Split className="pf-u-mt-sm">
      <SplitItem className="pf-u-mr-md">
        <CardIcon
          sourceId={sourceId}
          height={60}
          src={`${CATALOG_API_BASE}/portfolio_items/${portfolioItemId}/icon`}
        />
      </SplitItem>
      <SplitItem>
        <Level>
          <LevelItem className="pf-u-mr-lg">
            <Title headingLevel="h5" size="md">
              {jobName}
            </Title>
          </LevelItem>
          <LevelItem>
            <Title headingLevel="h5" size="md">
              {formatMessage(ordersMessages.orderStatus, {
                // eslint-disable-next-line react/display-name
                icon: () =>
                  state === 'Failed' ? (
                    <ExclamationCircleIcon className="pf-u-mr-sm icon-danger-fill" />
                  ) : null,
                state
              })}
            </Title>
          </LevelItem>
        </Level>
        <Level>
          <LevelItem className="pf-u-mr-lg">
            <TextContent>
              <Text component={TextVariants.small}>
                {formatMessage(statesMessages.ordered)}
                &nbsp;
                <DateFormat date={orderRequestDate} type="relative" />
              </Text>
            </TextContent>
          </LevelItem>
          <LevelItem className="pf-u-mr-lg">
            <TextContent>
              <Text component={TextVariants.small}>
                {formatMessage(ordersMessages.orderedBy, { owner })}
              </Text>
            </TextContent>
          </LevelItem>
          <LevelItem>
            <TextContent>
              <Text component={TextVariants.small}>
                {formatMessage(ordersMessages.lastUpdated)}
                &nbsp;
                <DateFormat date={orderUpdateDate} type="relative" />
              </Text>
            </TextContent>
          </LevelItem>
        </Level>
      </SplitItem>
    </Split>
  );
};

OrderDetailInformation.propTypes = {
  portfolioItemId: PropTypes.string.isRequired,
  sourceId: PropTypes.string.isRequired,
  state: PropTypes.string.isRequired,
  jobName: PropTypes.string.isRequired,
  orderRequestDate: PropTypes.string.isRequired,
  orderUpdateDate: PropTypes.string.isRequired,
  owner: PropTypes.string.isRequired
};

export default OrderDetailInformation;
