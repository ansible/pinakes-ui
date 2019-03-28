import React from 'react';
import PropTypes from 'prop-types';
import { CardBody, Text, TextContent, TextVariants } from '@patternfly/react-core';
import ItemDetails from './card-common';

const ServiceOfferingCardBody = ({ name, display_name, distributor, ...props }) =>(
  <CardBody style={ { height: 240 } }>
    <TextContent>
      <Text
        className="elipsis-text-overflow"
        component={ TextVariants.h3 }
        title={ display_name || name }
      >
        { display_name || name }
      </Text>
      <Text component={ TextVariants.small }>{ distributor }&nbsp;</Text>
    </TextContent>
    <ItemDetails { ...props } toDisplay={ [ props.long_description ? 'long_description' : 'description' ] } />
  </CardBody>
);

ServiceOfferingCardBody.propTypes = {
  name: PropTypes.string,
  display_name: PropTypes.string,
  distributor: PropTypes.string,
  long_description: PropTypes.string
};

export default ServiceOfferingCardBody;
