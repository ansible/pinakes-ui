/* eslint-disable react/prop-types */
import React from 'react';
import { LevelItem, Level, Title, Label } from '@patternfly/react-core';

import CardIcon from '../../../presentational-components/shared/card-icon';
import { CATALOG_API_BASE } from '../../../utilities/constants';
import CatalogLink from '../../common/catalog-link';
import statesMessages, {
  getTranslatableState
} from '../../../messages/states.messages';
import useFormatMessage from '../../../utilities/use-format-message';
import orderStatusMapper from '../order-status-mapper';

export interface OrderDetailInformationProps {
  portfolioItemId: string;
  sourceId: string;
  jobName: string;
  portfolioId: string;
  state: keyof typeof orderStatusMapper;
}
const OrderDetailInformation: React.ComponentType<OrderDetailInformationProps> = ({
  portfolioId,
  jobName,
  portfolioItemId,
  sourceId,
  state
}) => {
  const formatMessage = useFormatMessage();
  return (
    <Level className="pf-u-mt-sm" hasGutter>
      <Level hasGutter>
        <CardIcon
          sourceId={sourceId}
          height={60}
          src={`${CATALOG_API_BASE}/portfolio_items/${portfolioItemId}/icon`}
        />
        <Title headingLevel="h2" size="lg">
          <CatalogLink
            pathname="/portfolio/portfolio-item"
            searchParams={{
              portfolio: portfolioId,
              source: sourceId,
              'portfolio-item': portfolioItemId
            }}
          >
            {jobName}
          </CatalogLink>
        </Title>
      </Level>
      <LevelItem>
        <Label {...orderStatusMapper[state]} variant="outline">
          {formatMessage(statesMessages[getTranslatableState(state)])}
        </Label>
      </LevelItem>
    </Level>
  );
};

export default OrderDetailInformation;
