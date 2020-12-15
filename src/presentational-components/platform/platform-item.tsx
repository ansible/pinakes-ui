/* eslint-disable react/prop-types */
import React from 'react';
import { CardHeader, CardFooter, Level } from '@patternfly/react-core';

import CardIcon from '../shared/card-icon';
import CardCheckbox from '../shared/card-checkbox';
import ServiceOfferingCardBody from '../shared/service-offering-body';
import { StyledCard } from '../styled-components/styled-gallery';
import styled from 'styled-components';

const StyledLevel = styled(Level)`
  flex: 1;
`;

export interface PlatformItemProps {
  id: string;
  source_id?: string;
  editMode?: boolean;
  checked?: boolean;
  onToggleItemSelect: (value: any) => void;
}
const PlatformItem: React.ComponentType<PlatformItemProps> = (props) => (
  <StyledCard key={props.id} ouiaId={`platform-item${props.id}`}>
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

export default PlatformItem;
