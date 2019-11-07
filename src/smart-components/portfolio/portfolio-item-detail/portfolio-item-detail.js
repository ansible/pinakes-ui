import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter, Route } from 'react-router-dom';
import { Grid, GridItem } from '@patternfly/react-core';
import { Section } from '@redhat-cloud-services/frontend-components';

import OrderModal from '../../common/order-modal';
import ItemDetailInfoBar from './item-detail-info-bar';
import ItemDetailDescription from './item-detail-description';
import CopyPortfolioItemModal from './copy-portfolio-item-modal';
import { fetchPlatforms } from '../../../redux/actions/platform-actions';
import PortfolioItemDetailToolbar from './portfolio-item-detail-toolbar';
import TopToolbar from '../../../presentational-components/shared/top-toolbar';
import { fetchPortfolioItem, selectPortfolioItem } from '../../../redux/actions/portfolio-actions';
import { ProductLoaderPlaceholder } from '../../../presentational-components/shared/loader-placeholders';
import { uploadPortfolioItemIcon } from '../../../helpers/portfolio/portfolio-helper';

const PortfolioItemDetail = ({
  match: { path, url, params: { portfolioItemId }},
  source,
  product,
  portfolio,
  isLoading,
  orderFetching,
  fetchPlatforms,
  fetchPortfolioItem
}) => {
  const [ isOpen, setOpen ] = useState(false);
  useEffect(() => {
    fetchPlatforms();
    fetchPortfolioItem(portfolioItemId);
  }, [ path ]);

  const uploadIcon = file => uploadPortfolioItemIcon(product.id, file);

  if (isLoading) {
    return (
      <Section style={ { backgroundColor: 'white', minHeight: '100%' } }>
        <TopToolbar>
          <ProductLoaderPlaceholder />
        </TopToolbar>
      </Section>
    );
  }

  return (
    <Section style={ { backgroundColor: 'white', minHeight: '100%' } }>
      <Route path={ `${url}/order` } render={ props => <OrderModal { ...props } closeUrl={ url } serviceData={ product }/> }/>
      <Route
        path={ `${url}/copy` }
        render={ props => (
          <CopyPortfolioItemModal { ...props }  portfolioItemId={ product.id } portfolioId={ portfolio.id } closeUrl={ url }/>
        ) }
      />
      <PortfolioItemDetailToolbar
        uploadIcon={ uploadIcon }
        url={ url }
        isOpen={ isOpen }
        product={ product }
        setOpen={ setOpen }
        isFetching={ orderFetching }
      />
      <div style={ { padding: 32 } }>
        <Grid>
          <GridItem md={ 2 }>
            <ItemDetailInfoBar product={ product } portfolio={ portfolio } source={ source } />
          </GridItem>
          <GridItem md={ 10 }>
            <ItemDetailDescription product={ product } url={ url } />
          </GridItem>
        </Grid>
      </div>
    </Section>
  );
};

PortfolioItemDetail.propTypes = {
  match: PropTypes.shape({
    path: PropTypes.string.isRequired
  }).isRequired,
  portfolio: PropTypes.shape({
    id: PropTypes.string.isRequired
  }),
  product: PropTypes.shape({
    id: PropTypes.string
  }).isRequired,
  source: PropTypes.object,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  isLoading: PropTypes.bool,
  fetchPlatforms: PropTypes.func.isRequired,
  fetchPortfolioItem: PropTypes.func.isRequired,
  selectPortfolioItem: PropTypes.func.isRequired,
  orderFetching: PropTypes.bool
};

const mapStateToProps = ({
  portfolioReducer: { portfolioItem, isLoading, selectedPortfolio },
  platformReducer: { platforms },
  orderReducer: { isLoading: orderFetching }
}) => {
  const portfolio = selectedPortfolio;
  const product = portfolioItem;
  let source;

  if (product && platforms) {
    source = platforms.find(item => item.id == product.service_offering_source_ref); // eslint-disable-line eqeqeq
  }

  return ({
    isLoading: isLoading || !product || !portfolio || !source,
    portfolio,
    product,
    source,
    orderFetching
  });
};

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchPlatforms,
  fetchPortfolioItem,
  selectPortfolioItem
}, dispatch);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PortfolioItemDetail));
