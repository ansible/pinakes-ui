import React from 'react';
import PropTypes from 'prop-types';
import { CardHeader, CardFooter, Level } from '@patternfly/react-core';

import { CATALOG_API_BASE } from '../../utilities/constants';
import CardIcon from '../../presentational-components/shared/card-icon';
import CardCheckbox from '../../presentational-components/shared/card-checkbox';
import ServiceOfferingCardBody from '../../presentational-components/shared/service-offering-body';
import {
  StyledCard,
  StyledGalleryItem
} from '../../presentational-components/styled-components/styled-gallery';
import styled from 'styled-components';

const StyledLevel = styled(Level)`
  flex: 1;
`;

const PortfolioItem = (props) => (
  <StyledGalleryItem isDisabled={props.removeInProgress && props.isSelected}>
    <StyledCard>
      <CardHeader>
        <StyledLevel>
          <CardIcon
            src={`${CATALOG_API_BASE}/portfolio_items/${props.id}/icon`}
            sourceId={props.service_offering_source_ref}
          />
          {props.isSelectable && (
            <CardCheckbox
              handleCheck={() => props.onSelect(props.id)}
              isChecked={props.isSelected}
              id={props.id}
            />
          )}
        </StyledLevel>
      </CardHeader>
      <ServiceOfferingCardBody {...props} />
      <CardFooter></CardFooter>
    </StyledCard>
  </StyledGalleryItem>
);

PortfolioItem.propTypes = {
  id: PropTypes.string,
  platformId: PropTypes.string,
  service_offering_source_ref: PropTypes.string,
  isSelectable: PropTypes.bool,
  isSelected: PropTypes.bool,
  onSelect: PropTypes.func,
  orderUrl: PropTypes.string,
  removeInProgress: PropTypes.bool,
  portfolio_id: PropTypes.string,
  metadata: PropTypes.shape({
    user_capabilities: PropTypes.shape({ destroy: PropTypes.bool }).isRequired
  }).isRequired
};

export default PortfolioItem;
