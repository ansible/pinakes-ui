import React from 'react';
import PropTypes from 'prop-types';
import { LevelItem, Level, Title, Label } from '@patternfly/react-core';

import CardIcon from '../../../presentational-components/shared/card-icon';
import { CATALOG_API_BASE } from '../../../utilities/constants';
import CatalogLink from '../../common/catalog-link';
import statesMessages, {
  getTranslatableState
} from '../../../messages/states.messages';
import useFormatMessage from '../../../utilities/use-format-message';
import orderStatusMapper from '../order-status-mapper';

const OrderDetailInformation = ({
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
        <Title headingLevel="h2" size="3xl">
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

OrderDetailInformation.propTypes = {
  portfolioItemId: PropTypes.string.isRequired,
  sourceId: PropTypes.string.isRequired,
  jobName: PropTypes.string.isRequired,
  portfolioId: PropTypes.string.isRequired,
  state: PropTypes.string.isRequired
};

export default OrderDetailInformation;
