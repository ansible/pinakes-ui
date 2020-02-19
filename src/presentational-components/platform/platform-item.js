import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardHeader, CardFooter, Level } from '@patternfly/react-core';

import CardIcon from '../shared/card-icon';
import CardCheckbox from '../shared/card-checkbox';
import ServiceOfferingCardBody from '../shared/service-offering-body';

const PlatformItem = ({ src, ...props }) => (
  <Card key={props.id} className="content-gallery-card">
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
