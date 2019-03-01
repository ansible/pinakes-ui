import React from 'react';
import './platformcard.scss';
import PropTypes from 'prop-types';
import CatItemSvg from '../../assets/images/vendor-openshift.svg';
import ImageWithDefault from '../Shared/ImageWithDefault';
import { Card, CardHeader, CardFooter } from '@patternfly/react-core';
import CardCheckbox from '../Shared/CardCheckbox';
import ServiceOfferingCardBody from '../Shared/service-offering-body';

const PlatformItem = props =>(
  <Card key={ props.id } className="content-gallery-card">
    <CardHeader>
      <ImageWithDefault src={ props.imageUrl || CatItemSvg } width="30" height="20" />
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
  imageUrl: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  editMode: PropTypes.bool,
  checked: PropTypes.bool,
  onToggleItemSelect: PropTypes.func
};

export default PlatformItem;
