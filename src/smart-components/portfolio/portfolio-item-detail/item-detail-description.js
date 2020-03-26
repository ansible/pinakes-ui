import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';
import { Text, TextContent, TextVariants } from '@patternfly/react-core';

import EditPortfolioItem from './edit-portfolio-item';
import EditApprovalWorkflow from '../../../smart-components/common/edit-approval-workflow';
import { PORTFOLIO_ITEM_RESOURCE_TYPE } from '../../../utilities/constants';
import CatalogRoute from '../../../routing/catalog-route';

const ItemDetailDescription = ({ userCapabilities, product, url, search }) => (
  <Switch>
    <Route
      exact
      path={url}
      render={() => (
        <TextContent>
          {(product.description || product.long_description) && (
            <Text component={TextVariants.h6}>Overview</Text>
          )}
          {product.description && (
            <Text id="description" component={TextVariants.p}>
              {product.description}
            </Text>
          )}
          {product.long_description && (
            <Text id="long_description" component={TextVariants.p}>
              {product.long_description}
            </Text>
          )}
          {product.support_url && (
            <Text id="support_url" component={TextVariants.p}>
              <a
                href={product.support_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                Learn more
              </a>
            </Text>
          )}
          {product.documentation_url && (
            <Fragment>
              <Text component={TextVariants.h6}>Documentation</Text>
              <Text id="documentation_url" component={TextVariants.p}>
                <a
                  href={product.documentation_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Doc link
                </a>
              </Text>
            </Fragment>
          )}
        </TextContent>
      )}
    />
    <CatalogRoute
      exact
      path={`${url}/edit`}
      requiredCapabilities="update"
      userCapabilities={userCapabilities}
    >
      <EditPortfolioItem cancelUrl={url} product={product} />
    </CatalogRoute>
    <Route exact path={`${url}/edit-workflow`}>
      <EditApprovalWorkflow
        pushParam={{ pathname: url, search }}
        objectType={PORTFOLIO_ITEM_RESOURCE_TYPE}
        objectId={product.id}
        objectName={() => product.name}
        querySelector="portfolio-item"
      />
    </Route>
  </Switch>
);

ItemDetailDescription.propTypes = {
  product: PropTypes.shape({
    name: PropTypes.string,
    long_description: PropTypes.string,
    support_url: PropTypes.string,
    documentation_url: PropTypes.string,
    description: PropTypes.string,
    id: PropTypes.string.isRequired
  }).isRequired,
  url: PropTypes.string.isRequired,
  search: PropTypes.string.isRequired,
  userCapabilities: PropTypes.object.isRequired
};

export default ItemDetailDescription;
