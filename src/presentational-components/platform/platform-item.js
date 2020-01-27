import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardHeader, CardFooter } from '@patternfly/react-core';

import CardIcon from '../shared/card-icon';
import CardCheckbox from '../shared/card-checkbox';
import ServiceOfferingCardBody from '../shared/service-offering-body';
import './platform-card.scss';

const PlatformItem = ({ src, ...props }) => (
  <Card key={props.id} className="content-gallery-card">
    <CardHeader>
      <CardIcon src={src} style={{ height: 40 }} />
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
  onToggleItemSelect: PropTypes.func,
  src: PropTypes.string
};

export default PlatformItem;
