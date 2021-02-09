/* eslint-disable react/prop-types */
import React from 'react';
import {
  CardHeader,
  CardFooter,
  GalleryItem,
  Text,
  TextVariants,
  TextContent,
  TextListItemVariants,
  TextListItem
} from '@patternfly/react-core';
import ItemDetails, { ItemDetailsProps } from '../shared/card-common';

import { PLATFORM_TEMPLATES_ROUTE } from '../../constants/routes';
import EllipsisTextContainer from '../styled-components/ellipsis-text-container';
import CatalogLink from '../../smart-components/common/catalog-link';
import { StyledCard } from '../styled-components/styled-gallery';
import { StyledCardBody } from '../styled-components/card';
import CardIcon from '../shared/card-icon';
import { DateFormat } from '@redhat-cloud-services/frontend-components/components/cjs/DateFormat';

const TO_DISPLAY = ['description', 'modified'];

export interface PlatformCardProps extends ItemDetailsProps {
  name: string;
  id: string;
  source_type_id: string;
  imageUrl: string;
}
const PlatformCard: React.ComponentType<PlatformCardProps> = ({
  name,
  id,
  ...props
}) => {
  console.log('Debug - platform props:', props);
  return (
    <GalleryItem>
      <StyledCard key={id} ouiaId={`platform-${id}`}>
        <CardHeader>
          <CardIcon height={40} sourceId={id} />
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
              <TextContent className="pf-u-mb-md">
                <Text component={TextVariants.small} className="pf-u-mb-0">
                  Last refreshed &nbsp;
                  <DateFormat
                    date={props.refresh_finished_at}
                    type="relative"
                  />
                </Text>
              </TextContent>
            </CatalogLink>
          </TextContent>
          <ItemDetails {...{ name, ...props }} toDisplay={TO_DISPLAY} />
        </StyledCardBody>
        <CardFooter />
      </StyledCard>
    </GalleryItem>
  );
};

export default PlatformCard;
