import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';
import { Text, TextContent, TextVariants, Grid, GridItem } from '@patternfly/react-core';

import { allowNull } from '../../../helpers/shared/helpers';
import Pf4SelectWrapper from '../../../presentational-components/shared/pf4-select-wrapper';

const getWorkflowTitle = (workflows, workflowRef) => {
  let workflow = workflows.find(({ value }) => value === workflowRef);
  return workflow ? workflow.label : 'None';
};

const ItemDetailDescription = ({ product, url, workflows, workflow, setWorkflow }) => (
  <Fragment>
    <TextContent>
      <Text component={ TextVariants.p }>{ product.description }</Text>
      <Text component={ TextVariants.p }><a href="javascript:void(0)">Sample repository</a></Text>
      <Text component={ TextVariants.h6 }>Overview</Text>
      <Text component={ TextVariants.p }>{ product.description }</Text>
      <Text component={ TextVariants.p }>{ product.long_description }</Text>
      <Text component={ TextVariants.p }><a href={ product.support_url } target="_blank" rel="noopener noreferrer">Learn more</a></Text>
      <Text component={ TextVariants.h6 }>Documentation</Text>
      <Text component={ TextVariants.p }><a href={ product.documentation_url } target="_blank" rel="noopener noreferrer">Doc link</a></Text>
      <Route exact path={ `${url}` } render={ () => (
        <Fragment>
          <Text component={ TextVariants.h6 }>Approval workflow</Text>
          <Text component={ TextVariants.p }>{ getWorkflowTitle(workflows, product.workflow_ref) }</Text>
        </Fragment>
      ) } />
    </TextContent>
    <Route exact path={ `${url}/edit` } render={ () => (
      <Grid>
        <GridItem md={ 6 }>
          <Pf4SelectWrapper input={ {
            onChange: value => setWorkflow(value),
            value: workflow || undefined
          } } meta={ {} } label="Approval workflow" options={ workflows } id="change-workflow" />
        </GridItem>
      </Grid>
    ) } />
  </Fragment>
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
  })).isRequired,
  workflow: allowNull(PropTypes.string),
  setWorkflow: PropTypes.func.isRequired
};

export default ItemDetailDescription;

