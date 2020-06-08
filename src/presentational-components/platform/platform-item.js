import React from 'react';
import PropTypes from 'prop-types';
import { CardHeader, CardFooter, Level } from '@patternfly/react-core';

import CardIcon from '../shared/card-icon';
import CardCheckbox from '../shared/card-checkbox';
import ServiceOfferingCardBody from '../shared/service-offering-body';
import { StyledCard } from '../styled-components/styled-gallery';
import styled from 'styled-components';

const StyledLevel = styled(Level)`
  flex: 1;
`;

const PlatformItem = ({ src, ...props }) => (
  <StyledCard key={props.id}>
    <CardHeader>
      <StyledLevel>
        <CardIcon height={40} sourceId={props.source_id} />
        {props.editMode && (
          <CardCheckbox
            id={props.id}
            isChecked={props.checked}
            handleCheck={props.onToggleItemSelect}
          />
        )}
      </StyledLevel>
    </CardHeader>
    <ServiceOfferingCardBody {...props} />
    <CardFooter />
  </StyledCard>
);

PlatformItem.propTypes = {
  id: PropTypes.string.isRequired,
  service_offering_icon_id: PropTypes.string,
  source_id: PropTypes.string,
  platformId: PropTypes.string,
  name: PropTypes.string,
  editMode: PropTypes.bool,
  checked: PropTypes.bool,
  onToggleItemSelect: PropTypes.func,
  src: PropTypes.string
};

export default PlatformItem;
