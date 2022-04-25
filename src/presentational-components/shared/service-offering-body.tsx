/* eslint-disable react/prop-types */
import React, { Fragment } from 'react';
import { Text, TextContent, TextVariants } from '@patternfly/react-core';
import ItemDetails from './card-common';
import ConditionalLink from './conditional-link';
import EllipsisTextContainer from '../styled-components/ellipsis-text-container';
import { StyledCardBody } from '../styled-components/card';
import { StringObject } from '../../types/common-types';

export interface ServiceOfferingCardBodyProps {
  name?: string;
  display_name?: string;
  distributor?: string;
  pathname?: string;
  searchParams?: StringObject;
  preserveSearch?: boolean;
  description?: string;
  long_description?: string;
  portfolioName?: string;
}
const ServiceOfferingCardBody: React.ComponentType<ServiceOfferingCardBodyProps> = ({
  name,
  distributor,
  pathname,
  searchParams,
  preserveSearch,
  portfolioName,
  ...props
}) => (
  <StyledCardBody>
    <TextContent>
      <ConditionalLink
        pathname={pathname}
        searchParams={searchParams}
        preserveSearch={preserveSearch}
      >
        <Text component={TextVariants.h3} title={name}>
          <EllipsisTextContainer>{name}</EllipsisTextContainer>
        </Text>
      </ConditionalLink>
      {distributor && <Text component={TextVariants.small}>{distributor}</Text>}
      {portfolioName && (
        <Fragment>
          <Text className="pf-u-mb-0" component="small">
            Portfolio
          </Text>
          <Text>{portfolioName}</Text>
        </Fragment>
      )}
    </TextContent>
    <ItemDetails toDisplay={['description']} {...props} />
  </StyledCardBody>
);

export default ServiceOfferingCardBody;
