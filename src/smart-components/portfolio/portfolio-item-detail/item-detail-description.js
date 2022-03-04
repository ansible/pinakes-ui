import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';
import { Text, TextContent, TextVariants } from '@patternfly/react-core';

import EditPortfolioItem from './edit-portfolio-item';
import EditApprovalWorkflow from '../../../smart-components/common/edit-approval-workflow';
import { PORTFOLIO_ITEM_RESOURCE_TYPE } from '../../../utilities/constants';
import CatalogRoute from '../../../routing/catalog-route';
import portfolioMessages from '../../../messages/portfolio.messages';
import useFormatMessage from '../../../utilities/use-format-message';
import SetOrderProcessModal from '../../order-process/set-order-process-modal';
import { PORTFOLIO_ITEM_EDIT_ORDER_PROCESS_ROUTE } from '../../../constants/routes';

const ItemDetailDescription = ({
  userCapabilities,
  product,
  url,
  search,
  detailPaths,
  uploadIcon,
  resetIcon
}) => {
  const formatMessage = useFormatMessage();
  return (
    <Switch>
      <Route path={`${url}/edit-workflow`}>
        <EditApprovalWorkflow
          pushParam={{ pathname: url, search }}
          objectType={PORTFOLIO_ITEM_RESOURCE_TYPE}
          objectId={product.id}
          objectName={() => product.name}
          querySelector="portfolio-item"
        />
      </Route>
      <Route path={PORTFOLIO_ITEM_EDIT_ORDER_PROCESS_ROUTE}>
        <SetOrderProcessModal
          querySelector="portfolio-item"
          objectType={PORTFOLIO_ITEM_RESOURCE_TYPE}
          objectName={() => product.name}
          pushParam={{ pathname: url, search }}
        />
      </Route>
      <Route
        exact
        path={detailPaths}
        render={() => (
          <TextContent>
            {product.description && (
              <Text component={TextVariants.h6}>
                {formatMessage(portfolioMessages.portfolioItemOverview)}
              </Text>
            )}
            {product.description && (
              <Text id="description" component={TextVariants.p}>
                {product.description}
              </Text>
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
        <EditPortfolioItem
          cancelUrl={url}
          product={product}
          userCapabilities={userCapabilities}
          uploadIcon={uploadIcon}
          resetIcon={resetIcon}
        />
      </CatalogRoute>
    </Switch>
  );
};

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
  userCapabilities: PropTypes.object.isRequired,
  detailPaths: PropTypes.arrayOf(PropTypes.string),
  uploadIcon: PropTypes.func.isRequired,
  resetIcon: PropTypes.func.isRequired
};

export default ItemDetailDescription;
