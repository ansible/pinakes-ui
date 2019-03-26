import React from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';
import { Level, LevelItem, Text, TextContent, TextVariants } from '@patternfly/react-core';

import EditToolbarActions from './edit-toolbar-actions';
import DetailToolbarActions from './detail-toolbar-actions';
import TopToolbar from '../../../presentational-components/shared/top-toolbar';

const PortfolioItemDetailToolbar = ({
  url,
  isOpen,
  product,
  setOpen,
  setWorkflow,
  handleUpdate
}) => (
  <TopToolbar>
    <Level>
      <LevelItem>
        <TextContent>
          <Text component={ TextVariants.h1 }>
            { product.display_name || product.name }
          </Text>
        </TextContent>
      </LevelItem>
      <LevelItem>
        <Level>
          <Route exact path={ url } render={ (...args) => (
            <DetailToolbarActions
              isOpen={ isOpen }
              setOpen={ setOpen }
              orderUrl={ `${url}/order` }
              editUrl={ `${url}/edit` }
              { ...args }
            />) }/>
          <Route exact path={ `${url}/edit` } render={ (...args) => (
            <EditToolbarActions
              detailUrl={ url }
              onSave={ handleUpdate }
              resetWorkflow={ () => setWorkflow(product.workflow_ref) }
              { ...args }
            />
          ) }
          />
        </Level>
      </LevelItem>
    </Level>
    <Level>
      <LevelItem>
        <TextContent>
          <Text component={ TextVariants.small }>
            { product.distributor }&nbsp;
          </Text>
        </TextContent>
      </LevelItem>
    </Level>
  </TopToolbar>
);

PortfolioItemDetailToolbar.propTypes = {
  url: PropTypes.string.isRequired,
  isOpen: PropTypes.bool,
  product: PropTypes.shape({
    display_name: PropTypes.string,
    distributor: PropTypes.string,
    name: PropTypes.string.isRequired,
    workflow_ref: PropTypes.string
  }).isRequired,
  setOpen: PropTypes.func.isRequired,
  setWorkflow: PropTypes.func.isRequired,
  handleUpdate: PropTypes.func.isRequired
};

export default PortfolioItemDetailToolbar;

