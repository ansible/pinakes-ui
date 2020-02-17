import React from 'react';
import propTypes from 'prop-types';
import {
  CardHeader,
  CardBody,
  CardFooter,
  GalleryItem,
  Text,
  TextVariants,
  TextContent
} from '@patternfly/react-core';
import DefaultPlatformImg from '../../assets/images/platform-default.svg';
import OpenshiftPlatformImg from '../../assets/images/platform-openshift.svg';
import AmazonPlatformImg from '../../assets/images/platform-amazon.png';
import TowerPlatformImg from '../../assets/images/platform-tower.png';
import ImageWithDefault from '../shared/image-with-default';
import ItemDetails from '../shared/card-common';

import { PLATFORM_TEMPLATES_ROUTE } from '../../constants/routes';
import EllipsisTextContainer from '../styled-components/ellipsis-text-container';
import CatalogLink from '../../smart-components/common/catalog-link';
import { StyledCard } from '../styled-components/styled-gallery';

const TO_DISPLAY = ['description', 'modified'];

const platformTypeImg = {
  1: OpenshiftPlatformImg,
  2: AmazonPlatformImg,
  3: TowerPlatformImg
};

const PlatformCard = ({ name, id, ...props }) => (
  <GalleryItem>
    <StyledCard key={id}>
      <CardHeader>
        <ImageWithDefault
          src={platformTypeImg[props.source_type_id] || DefaultPlatformImg}
          width="80"
          height="40"
        />
      </CardHeader>
      <CardBody>
        <TextContent>
          <CatalogLink
            pathname={PLATFORM_TEMPLATES_ROUTE}
            searchParams={{ platform: id }}
          >
            <Text
              title={name}
              className="pf-u-mb-0"
              component={TextVariants.h3}
            >
              <EllipsisTextContainer>{name}</EllipsisTextContainer>
            </Text>
          </CatalogLink>
        </TextContent>
        <ItemDetails {...{ name, ...props }} toDisplay={TO_DISPLAY} />
      </CardBody>
      <CardFooter />
    </StyledCard>
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
