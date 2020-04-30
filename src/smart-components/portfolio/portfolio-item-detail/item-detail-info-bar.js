import React from 'react';
import PropTypes from 'prop-types';
import { Text, TextContent, TextVariants } from '@patternfly/react-core';
import { DateFormat } from '@redhat-cloud-services/frontend-components/components/DateFormat';

const ItemDetailInfoBar = ({ product, source, portfolio }) => (
  <TextContent className="pf-u-mb-md">
    <Text className="font-14">Platform</Text>
    <Text id="source-name" className="overflow-wrap" component={TextVariants.p}>
      {source.name}
    </Text>
    <Text className="font-14">Portfolio</Text>
    <Text
      id="portfolio-name"
      className="overflow-wrap"
      component={TextVariants.p}
    >
      {portfolio.name}
    </Text>
    {product.distributor && (
      <span id="distributor">
        <Text className="font-14">Vendor</Text>
        <Text className="overflow-wrap" component={TextVariants.p}>
          {product.distributor}
        </Text>
      </span>
    )}
    <Text className="font-14">Created</Text>
    <Text id="created_at" component={TextVariants.p}>
      <DateFormat variant="relative" date={product.created_at} />
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
