import React from 'react';
import PropTypes from 'prop-types';
import {
  CardBody,
  Text,
  TextContent,
  TextVariants
} from '@patternfly/react-core';
import ItemDetails from './card-common';
import ConditionalLink from './conditional-link';
import EllipsisTextContainer from '../styled-components/ellipsis-text-container';
import styled from 'styled-components';

const StyledCardBody = styled(CardBody)`
  height: 240px;
`;

const ServiceOfferingCardBody = ({
  name,
  display_name,
  distributor,
  pathname,
  searchParams,
  preserveSearch,
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
      <Text component={TextVariants.small}>{distributor}&nbsp;</Text>
    </TextContent>
    <ItemDetails
      {...props}
      toDisplay={[props.description ? 'description' : 'long_description']}
    />
  </StyledCardBody>
);

ServiceOfferingCardBody.propTypes = {
  name: PropTypes.string,
  display_name: PropTypes.string,
  distributor: PropTypes.string,
  long_description: PropTypes.string,
  description: PropTypes.string,
  pathname: PropTypes.string,
  preserveSearch: PropTypes.bool,
  searchParams: PropTypes.shape({ [PropTypes.string]: PropTypes.string })
};

export default ServiceOfferingCardBody;
