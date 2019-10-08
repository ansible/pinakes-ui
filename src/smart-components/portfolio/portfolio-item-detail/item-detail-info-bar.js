import React from 'react';
import PropTypes from 'prop-types';
import { Text, TextContent, TextVariants } from '@patternfly/react-core';

const ItemDetailInfoBar = ({ product, source, portfolio }) => (
  <TextContent>
    <Text component={ TextVariants.h6 }>
      <span>
        Platform
      </span>
      <br />
      <div className="elipsis-text-overflow">
        <span>
          { source.name }
        </span>
      </div>
    </Text>
    <Text component={ TextVariants.h6 }>
      <span>
        Portfolio
      </span>
      <br />
      <div className="elipsis-text-overflow">
        <span>
          { portfolio.display_name || portfolio.name }
        </span>
      </div>
    </Text>
    { product.distributor && (
      <Text component={ TextVariants.h6 }>
        <span>
          Vendor
        </span>
        <br />
        <div className="elipsis-text-overflow">
          <span>
            { product.distributor }
          </span>
        </div>
      </Text>
    ) }
    <Text component={ TextVariants.h6 }>
      <span>
        Created at
      </span>
      <br />
      <div className="elipsis-text-overflow">
        <span>
          { new Date(product.updated_at || product.created_at).toLocaleDateString() }
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
    display_name: PropTypes.string,
    name: PropTypes.string.isRequired
  }).isRequired
};

export default ItemDetailInfoBar;

