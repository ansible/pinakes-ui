import React from 'react';
import propTypes from 'prop-types';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  GalleryItem
} from '@patternfly/react-core';
import DefaultPlatformImg from '../../assets/images/platform-default.svg';
import OpenshiftPlatformImg from '../../assets/images/platform-openshift.svg';
import AmazonPlatformImg from '../../assets/images/platform-amazon.png';
import TowerPlatformImg from '../../assets/images/platform-tower.png';
import ImageWithDefault from '../shared/image-with-default';
import ItemDetails from '../shared/card-common';

import './platform-card.scss';
import CatalogLink from '../../smart-components/common/catalog-link';

const TO_DISPLAY = ['description', 'modified'];

const platformTypeImg = {
  1: OpenshiftPlatformImg,
  2: AmazonPlatformImg,
  3: TowerPlatformImg
};

const PlatformCard = ({ name, id, ...props }) => (
  <GalleryItem>
    <CatalogLink
      pathname="/platform/platform-templates"
      searchParams={{ platform: id }}
      className="card-link"
    >
      <Card key={id} className="content-gallery-card">
        <CardHeader>
          <ImageWithDefault
            src={platformTypeImg[props.source_type_id] || DefaultPlatformImg}
            width="80"
            height="40"
          />
        </CardHeader>
        <CardBody>
          <h4>{name}</h4>
          <ItemDetails {...{ name, ...props }} toDisplay={TO_DISPLAY} />
        </CardBody>
        <CardFooter />
      </Card>
    </CatalogLink>
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
