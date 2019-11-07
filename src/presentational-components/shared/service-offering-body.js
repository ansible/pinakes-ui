import React from 'react';
import PropTypes from 'prop-types';
import { CardBody, Text, TextContent, TextVariants } from '@patternfly/react-core';
import ItemDetails from './card-common';
import ConditionalLink from './conditional-link';

const ServiceOfferingCardBody = ({ name, display_name, distributor, url, ...props }) =>(
  <CardBody style={ { height: 240 } }>
    <TextContent>
      <ConditionalLink to={ url }>
        <Text
          className="elipsis-text-overflow"
          component={ TextVariants.h3 }
          title={ display_name || name }
        >
          { display_name || name }
        </Text>
      </ConditionalLink>
      <Text component={ TextVariants.small }>{ distributor }&nbsp;</Text>
    </TextContent>
    <ItemDetails { ...props } toDisplay={ [ props.description ? 'description' : 'long_description' ] } />
  </CardBody>
);

ServiceOfferingCardBody.propTypes = {
  name: PropTypes.string,
  display_name: PropTypes.string,
  distributor: PropTypes.string,
  long_description: PropTypes.string,
  description: PropTypes.string,
  url: PropTypes.string
};

export default ServiceOfferingCardBody;
