import React from 'react';
import PropTypes from 'prop-types';
import { Text, TextContent, TextVariants } from '@patternfly/react-core';
import { DateFormat } from '@redhat-cloud-services/frontend-components/components/DateFormat';
import EllipsisTextContainer from '../../../presentational-components/styled-components/ellipsis-text-container';

const ItemDetailInfoBar = ({ product, source, portfolio }) => (
  <TextContent>
    <Text id="source-name" component={TextVariants.h6}>
      <span>Platform</span>
      <br />
      <EllipsisTextContainer>
        <span>{source.name}</span>
      </EllipsisTextContainer>
    </Text>
    <Text id="portfolio-name" component={TextVariants.h6}>
      <span>Portfolio</span>
      <br />
      <EllipsisTextContainer>
        <span>{portfolio.name}</span>
      </EllipsisTextContainer>
    </Text>
    {product.distributor && (
      <Text id="distributor" component={TextVariants.h6}>
        <span>Vendor</span>
        <br />
        <EllipsisTextContainer>
          <span>{product.distributor}</span>
        </EllipsisTextContainer>
      </Text>
    )}
    <Text id="created_at" component={TextVariants.h6}>
      <span>Created at</span>
      <br />
      <EllipsisTextContainer>
        <DateFormat variant="relative" date={product.created_at} />
      </EllipsisTextContainer>
    </Text>
  </TextContent>
);

ItemDetailInfoBar.propTypes = {
  product: PropTypes.shape({
    distributor: PropTypes.string,
    updated_at: PropTypes.string,
    created_at: PropTypes.string.isRequired
  }).isRequired,
  source: PropTypes.shape({
    name: PropTypes.string
  }).isRequired,
  portfolio: PropTypes.shape({
    name: PropTypes.string
  }).isRequired
};

export default ItemDetailInfoBar;
