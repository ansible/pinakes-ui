import React from 'react';
import './platformcard.scss';
import PropTypes from 'prop-types';
import CatItemSvg from '../../assets/images/vendor-openshift.svg';
import ImageWithDefault from '../Shared/ImageWithDefault';
import { GridItem, Card, CardHeader, CardFooter } from '@patternfly/react-core';
import CardCheckbox from '../Shared/CardCheckbox';
import ServiceOfferingCardBody from '../Shared/service-offering-body';

const PlatformItem = props =>(
  <GridItem key={ props.id } sm={ 12 } md={ 6 } lg={ 4 } xl={ 3 }>
    <Card key={ props.id }>
      <CardHeader className="pcard_header">
        <ImageWithDefault src={ props.imageUrl || CatItemSvg } width="30" height="20" />
        { props.editMode && (
          <CardCheckbox
            id={ props.id }
            checked={ props.checked }
            onChange={ props.onToggleItemSelect }
          />
        ) }
      </CardHeader>
      <ServiceOfferingCardBody { ...props }/>
      <CardFooter/>
    </Card>
  </GridItem>
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
