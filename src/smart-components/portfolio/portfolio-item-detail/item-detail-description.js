import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';
import { Text, TextContent, TextVariants } from '@patternfly/react-core';

import EditPortfolioItem from './edit-portfolio-item';

const getWorkflowTitle = (workflows, workflowRef) => {
  let workflow = workflows.find(({ value }) => value === workflowRef);
  return workflow ? workflow.label : 'None';
};

const ItemDetailDescription = ({ product, url, workflows }) => (
  <Switch>
    <Route exact path={ `${url}` } render={ () => (
      <TextContent>
        { (product.description || product.long_description) && (
          <Text component={ TextVariants.h6 }>Overview</Text>
        ) }
        { product.description && (
          <Text component={ TextVariants.p }>{ product.description }</Text>
        ) }
        { product.long_description && (
          <Text component={ TextVariants.p }>{ product.long_description }</Text>
        ) }
        { product.support_url && (
          <Text component={ TextVariants.p }><a href={ product.support_url } target="_blank" rel="noopener noreferrer">Learn more</a></Text>
        ) }
        { product.documentation_url && (
          <Fragment>
            <Text component={ TextVariants.h6 }>Documentation</Text>
            <Text component={ TextVariants.p }>
              <a href={ product.documentation_url } target="_blank" rel="noopener noreferrer">Doc link</a>
            </Text>
          </Fragment>
        ) }
        <Route exact path={ `${url}` } render={ () => (
          <Fragment>
            <Text component={ TextVariants.h6 }>Approval workflow</Text>
            <Text component={ TextVariants.p }>{ getWorkflowTitle(workflows, product.workflow_ref) }</Text>
          </Fragment>
        ) } />

      </TextContent>
    ) }/>
    <Route exact path={ `${url}/edit` } render={ () => <EditPortfolioItem cancelUrl={ url } product={ product } workflows={ workflows } /> } />
  </Switch>
);

ItemDetailDescription.propTypes = {
  product: PropTypes.shape({
    dscription: PropTypes.string,
    long_description: PropTypes.string,
    support_url: PropTypes.string,
    documentation_url: PropTypes.string
  }).isRequired,
  url: PropTypes.string.isRequired,
  workflows: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired
  })).isRequired
};

export default ItemDetailDescription;

