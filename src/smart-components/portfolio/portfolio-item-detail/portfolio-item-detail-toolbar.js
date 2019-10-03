import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';
import { Level, LevelItem, Text, TextContent, TextVariants } from '@patternfly/react-core';

import DetailToolbarActions from './detail-toolbar-actions';
import { CATALOG_API_BASE } from '../../../utilities/constants';
import CardIcon from '../../../presentational-components/shared/card-icon';
import TopToolbar from '../../../presentational-components/shared/top-toolbar';
import IconUpload from './icon-upload';

const PortfolioItemDetailToolbar = ({
  url,
  isOpen,
  product,
  setOpen,
  isFetching,
  uploadIcon
}) => (
  <Fragment>
    <TopToolbar>
      <div style={ { float: 'left' } } className="pf-u-mr-sm">
        <IconUpload uploadIcon={ uploadIcon }>
          <CardIcon src={ `${CATALOG_API_BASE}/portfolio_items/${product.id}/icon` }
            platformId={ product.service_offering_source_ref } height={ 64 }/>
        </IconUpload>
      </div>
      <Level>
        <LevelItem>
          <TextContent>
            <Text component={ TextVariants.h1 }>
              { product.display_name || product.name }
            </Text>
          </TextContent>
        </LevelItem>
        <LevelItem style={ { minHeight: 36 } }>
          <Level>
            <Route exact path={ url } render={ (...args) => (
              <DetailToolbarActions
                isOpen={ isOpen }
                setOpen={ open => setOpen(open) }
                orderUrl={ `${url}/order` }
                editUrl={ `${url}/edit` }
                copyUrl={ `${url}/copy` }
                isFetching={ isFetching }
                { ...args }
              />) }/>
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
  </Fragment>
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
  isFetching: PropTypes.bool,
  uploadIcon: PropTypes.func.isRequired
};

PortfolioItemDetailToolbar.defaultProps = {
  isFetching: false
};

export default PortfolioItemDetailToolbar;

