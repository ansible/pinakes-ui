import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardHeader, CardFooter } from '@patternfly/react-core';

import CardIcon from '../Shared/card-icon';
import CardCheckbox from '../Shared/card-checkbox';
import ServiceOfferingCardBody from '../Shared/service-offering-body';
import { TOPOLOGICAL_INVENTORY_API_BASE } from '../../Utilities/Constants';

import './platform-card.scss';

const PlatformItem = props =>(
  <Card key={ props.id } className="content-gallery-card">
    <CardHeader>
      <CardIcon
        src={ `${TOPOLOGICAL_INVENTORY_API_BASE}/service_offering_icons/${props.service_offering_icon_id}/icon_data` }
        style={ { height: 40 } }
      />
      { props.editMode && (
        <CardCheckbox
          id={ props.id }
          isChecked={ props.checked }
          handleCheck={ props.onToggleItemSelect }
        />
      ) }
    </CardHeader>
    <ServiceOfferingCardBody { ...props }/>
    <CardFooter/>
  </Card>
);

PlatformItem.propTypes = {
  id: PropTypes.string.isRequired,
  service_offering_icon_id: PropTypes.string,
  name: PropTypes.string,
  editMode: PropTypes.bool,
  checked: PropTypes.bool,
  onToggleItemSelect: PropTypes.func
};

export default PlatformItem;
