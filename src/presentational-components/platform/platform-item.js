import React from 'react';
import PropTypes from 'prop-types';
import { CardHeader, CardFooter, Level } from '@patternfly/react-core';

import CardIcon from '../shared/card-icon';
import CardCheckbox from '../shared/card-checkbox';
import ServiceOfferingCardBody from '../shared/service-offering-body';
import { StyledCard } from '../styled-components/styled-gallery';

const PlatformItem = ({ src, ...props }) => (
  <StyledCard key={props.id}>
    <CardHeader>
      <Level>
        <CardIcon height={40} sourceId={props.source_id} />
        {props.editMode && (
          <CardCheckbox
            id={props.id}
            isChecked={props.checked}
            handleCheck={props.onToggleItemSelect}
          />
        )}
      </Level>
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
