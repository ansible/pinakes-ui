import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardHeader, CardFooter } from '@patternfly/react-core';

import CardIcon from '../shared/card-icon';
import CardCheckbox from '../shared/card-checkbox';
import ServiceOfferingCardBody from '../shared/service-offering-body';
import { TOPOLOGICAL_INVENTORY_API_BASE } from '../../utilities/constants';
import './platform-card.scss';

const PlatformItem = (props) => (
  <Card key={props.id} className="content-gallery-card">
    <CardHeader>
      <CardIcon
        src={`${TOPOLOGICAL_INVENTORY_API_BASE}/service_offering_icons/${props.service_offering_icon_id}/icon_data`}
        style={{ height: 40 }}
        sourceId={props.source_id}
      />
      {props.editMode && (
        <CardCheckbox
          id={props.id}
          isChecked={props.checked}
          handleCheck={props.onToggleItemSelect}
        />
      )}
    </CardHeader>
    <ServiceOfferingCardBody {...props} />
    <CardFooter />
  </Card>
);

PlatformItem.propTypes = {
  id: PropTypes.string.isRequired,
  service_offering_icon_id: PropTypes.string,
  source_id: PropTypes.string,
  platformId: PropTypes.string,
  name: PropTypes.string,
  editMode: PropTypes.bool,
  checked: PropTypes.bool,
  onToggleItemSelect: PropTypes.func
};

export default PlatformItem;
