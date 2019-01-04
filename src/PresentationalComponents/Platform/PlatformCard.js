import React from 'react';
import './platformcard.scss';
import propTypes from 'prop-types';
import DefaultPlatformImg from '../../assets/images/platform-default.svg';
import OpenshiftPlatformImg from '../../assets/images/platform-openshift.svg';
import AmazonPlatformImg from '../../assets/images/platform-amazon.png';
import ImageWithDefault from '../Shared/ImageWithDefault';
import ItemDetails from '../Shared/CardCommon';
import { GridItem, Card, CardHeader, CardBody, CardFooter } from '@patternfly/react-core';

const TO_DISPLAY = [ 'description', 'modified' ];

// TO DO - use webpack to load all images
const platformTypeImg = (sourceTypeId) => {
  switch (sourceTypeId) {
    case '1':
      return OpenshiftPlatformImg;
    case '2':
      return AmazonPlatformImg;
    default:
      return DefaultPlatformImg;
  }
};

const PlatformCard = ({ name, id, ...props }) => (
  <GridItem sm={ 6 } md={ 4 } lg={ 4 } xl={ 3 }>
    <Card className="card_style" key={ id }>
      <CardHeader className="pcard_header">
        <ImageWithDefault src={ platformTypeImg(props.source_type_id || '0') } defaultSrc={ DefaultPlatformImg } width="80" height="40"/>
      </CardHeader>
      <CardBody className="pcard_body">
        <h4>{ name }</h4>
        <ItemDetails { ...{ name, ...props } } toDisplay={ TO_DISPLAY } />
      </CardBody>
      <CardFooter/>
    </Card>
  </GridItem>
);

PlatformCard.propTypes = {
  history: propTypes.object,
  imageUrl: propTypes.string,
  name: propTypes.string,
  source_type_id: propTypes.string,
  id: propTypes.string
};

export default PlatformCard;
