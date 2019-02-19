import React from 'react';
import propTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { GridItem, Card, CardHeader, CardBody, CardFooter } from '@patternfly/react-core';
import DefaultPlatformImg from '../../assets/images/platform-default.svg';
import OpenshiftPlatformImg from '../../assets/images/platform-openshift.svg';
import AmazonPlatformImg from '../../assets/images/platform-amazon.png';
import ImageWithDefault from '../Shared/ImageWithDefault';
import ItemDetails from '../Shared/CardCommon';
import './platformcard.scss';

const TO_DISPLAY = [ 'description', 'modified' ];

// TO DO - use webpack to load all images
const platformTypeImg = {
  1: OpenshiftPlatformImg,
  2: AmazonPlatformImg
};

const PlatformCard = ({ name, id, ...props }) => (
  <GridItem sm={ 6 } md={ 4 } lg={ 4 } xl={ 3 }>
    <Link to={ `/platform/${id}` } className="card-link">
      <Card key={ id }>
        <CardHeader className="pcard_header">
          <ImageWithDefault src={ platformTypeImg[props.source_type_id] || DefaultPlatformImg } width="80" height="40"/>
        </CardHeader>
        <CardBody className="pcard_body">
          <h4>{ name }</h4>
          <ItemDetails { ...{ name, ...props } } toDisplay={ TO_DISPLAY } />
        </CardBody>
        <CardFooter/>
      </Card>
    </Link>
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
