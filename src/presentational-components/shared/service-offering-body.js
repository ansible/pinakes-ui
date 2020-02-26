import React, { Fragment } from 'react';
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
    <ItemDetails
      toDisplay={[props.description ? 'description' : 'long_description']}
      {...props}
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
  searchParams: PropTypes.shape({ [PropTypes.string]: PropTypes.string }),
  portfolioName: PropTypes.string
};

export default ServiceOfferingCardBody;
