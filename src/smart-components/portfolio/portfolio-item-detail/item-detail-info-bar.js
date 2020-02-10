import React from 'react';
import PropTypes from 'prop-types';
import { Text, TextContent, TextVariants } from '@patternfly/react-core';
import { DateFormat } from '@redhat-cloud-services/frontend-components';

const ItemDetailInfoBar = ({ product, source, portfolio }) => (
  <TextContent>
    <Text id="source-name" component={TextVariants.h6}>
      <span>Platform</span>
      <br />
      <div className="elipsis-text-overflow">
        <span>{source.name}</span>
      </div>
    </Text>
    <Text id="portfolio-name" component={TextVariants.h6}>
      <span>Portfolio</span>
      <br />
      <div className="elipsis-text-overflow">
        <span>{portfolio.name}</span>
      </div>
    </Text>
    {product.distributor && (
      <Text id="distributor" component={TextVariants.h6}>
        <span>Vendor</span>
        <br />
        <div className="elipsis-text-overflow">
          <span>{product.distributor}</span>
        </div>
      </Text>
    )}
    <Text id="created_at" component={TextVariants.h6}>
      <span>Created at</span>
      <br />
      <div className="elipsis-text-overflow">
        <span>
          <DateFormat variant="relative" date={product.created_at} />
        </span>
      </div>
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
    name: PropTypes.string.isRequired
  }).isRequired,
  portfolio: PropTypes.shape({
    name: PropTypes.string.isRequired
  }).isRequired
};

export default ItemDetailInfoBar;
