import React from 'react';
import PropTypes from 'prop-types';
import { Text, TextContent, TextVariants } from '@patternfly/react-core';

const ItemDetailInfoBar = ({ product, source, portfolio }) => (
  <TextContent>
    <Text component={ TextVariants.h6 }>Platform <br />{ source.name }</Text>
    <Text component={ TextVariants.h6 }>Portfolio <br />{ portfolio.display_name || portfolio.name }</Text>
    { product.distributor && (
      <Text component={ TextVariants.h6 }>Vendor <br />{ product.distributor }</Text>
    ) }
    <Text component={ TextVariants.h6 }>Created at <br />{ new Date(product.updated_at || product.created_at).toLocaleDateString() }</Text>
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
    display_name: PropTypes.string,
    name: PropTypes.string.isRequired
  }).isRequired
};

export default ItemDetailInfoBar;

