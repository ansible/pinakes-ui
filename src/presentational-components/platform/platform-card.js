import React from 'react';
import propTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardBody, CardFooter, GalleryItem } from '@patternfly/react-core';
import DefaultPlatformImg from '../../assets/images/platform-default.svg';
import OpenshiftPlatformImg from '../../assets/images/platform-openshift.svg';
import AmazonPlatformImg from '../../assets/images/platform-amazon.png';
import ImageWithDefault from '../shared/image-with-default';
import ItemDetails from '../shared/card-common';

import './platform-card.scss';

const TO_DISPLAY = [ 'description', 'modified' ];

// TO DO - use webpack to load all images
const platformTypeImg = {
  1: OpenshiftPlatformImg,
  2: AmazonPlatformImg
};

const PlatformCard = ({ name, id, ...props }) => (
  <GalleryItem>
    <Link to={ `/platforms/detail/${id}` } className="card-link">
      <Card key={ id } className="content-gallery-card">
        <CardHeader>
          <ImageWithDefault src={ platformTypeImg[props.source_type_id] || DefaultPlatformImg } width="80" height="40"/>
        </CardHeader>
        <CardBody>
          <h4>{ name }</h4>
          <ItemDetails { ...{ name, ...props } } toDisplay={ TO_DISPLAY } />
        </CardBody>
        <CardFooter/>
      </Card>
    </Link>
  </GalleryItem>
);

PlatformCard.propTypes = {
  history: propTypes.object,
  imageUrl: propTypes.string,
  name: propTypes.string,
  source_type_id: propTypes.string,
  id: propTypes.string
};

export default PlatformCard;
