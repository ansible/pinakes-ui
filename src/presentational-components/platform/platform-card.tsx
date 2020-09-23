/* eslint-disable react/prop-types */
import React from 'react';
import {
  CardHeader,
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
import ItemDetails, { ItemDetailsProps } from '../shared/card-common';

import { PLATFORM_TEMPLATES_ROUTE } from '../../constants/routes';
import EllipsisTextContainer from '../styled-components/ellipsis-text-container';
import CatalogLink from '../../smart-components/common/catalog-link';
import { StyledCard } from '../styled-components/styled-gallery';
import { StyledCardBody } from '../styled-components/card';

const TO_DISPLAY = ['description', 'modified'];

const platformTypeImg = {
  1: OpenshiftPlatformImg,
  2: AmazonPlatformImg,
  3: TowerPlatformImg
};

export interface PlatformCardProps extends ItemDetailsProps {
  name: string;
  id: string;
  source_type_id: keyof typeof platformTypeImg;
  imageUrl: string;
}
const PlatformCard: React.ComponentType<PlatformCardProps> = ({
  name,
  id,
  ...props
}) => (
  <GalleryItem>
    <StyledCard key={id}>
      <CardHeader>
        <ImageWithDefault
          src={platformTypeImg[props.source_type_id] || DefaultPlatformImg}
          width="80"
          height="40"
        />
      </CardHeader>
      <StyledCardBody>
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
      </StyledCardBody>
      <CardFooter />
    </StyledCard>
  </GalleryItem>
);

export default PlatformCard;
