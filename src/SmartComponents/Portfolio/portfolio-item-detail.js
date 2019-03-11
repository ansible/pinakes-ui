import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Route, Link } from 'react-router-dom';
import { Section } from '@red-hat-insights/insights-frontend-components';
import { Level, LevelItem, Text, TextContent, TextVariants, Button, Grid, GridItem } from '@patternfly/react-core';
import { fetchPlatforms } from '../../redux/Actions/PlatformActions';
import TopToolbar from '../../PresentationalComponents/Shared/top-toolbar';
import OrderModal from '../Common/OrderModal';
import { bindActionCreators } from 'redux';
import { fetchPortfolioItem } from '../../redux/Actions/PortfolioActions';
import { ProductLoaderPlaceholder } from '../../PresentationalComponents/Shared/LoaderPlaceholders';

const PortfolioItemDetail = ({
  match: { path, url, params: { portfolioItemId }},
  portfolio,
  product,
  source,
  isLoading,
  fetchPlatforms,
  fetchPortfolioItem
}) => {
  useEffect(() => {
    fetchPlatforms();
    fetchPortfolioItem(portfolioItemId);
  }, [ path ]);
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
            <Link to={ `${url}/order` }>
              <Button variant="primary">Order</Button>
            </Link>
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
      <div style={ { padding: 32 } }>
        <Grid>
          <GridItem md={ 2 }>
            <TextContent>
              <Text component={ TextVariants.h6 }>Platform <br />{ source.name }</Text>
              <Text component={ TextVariants.h6 }>Portfolio <br />{ portfolio.display_name || portfolio.name }</Text>
              <Text component={ TextVariants.h6 }>Vendor <br />{ product.distributor || 'Missing API data' }</Text>
              <Text component={ TextVariants.h6 }>Created at <br />{ new Date(product.updated_at || product.created_at).toLocaleDateString() }</Text>
            </TextContent>
          </GridItem>
          <GridItem md={ 10 }>
            <TextContent>
              <Text component={ TextVariants.p }>{ product.description }</Text>
              <Text component={ TextVariants.p }><a href="javascript:void(0)">Sample repository</a></Text>
              <Text component={ TextVariants.h6 }>Overview</Text>
              <Text component={ TextVariants.p }>{ product.description }</Text>
              <Text component={ TextVariants.p }>{ product.long_description }</Text>
              <Text component={ TextVariants.p }><a href={ product.support_url } target="_blank" rel="noopener noreferrer">Learn more</a></Text>
              <Text component={ TextVariants.h6 }>Documentation</Text>
              <Text component={ TextVariants.p }><a href={ product.documentation_url } target="_blank" rel="noopener noreferrer">Doc link</a></Text>
            </TextContent>
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
    id: PropTypes.number
  }).isRequired,
  source: PropTypes.shape({

  }),
  isLoading: PropTypes.bool,
  fetchPlatforms: PropTypes.func.isRequired,
  fetchPortfolioItem: PropTypes.func.isRequired
};

const mapStateToProps = ({
  portfolioReducer: { portfolioItem, isLoading, selectedPortfolio },
  platformReducer: { platforms }
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
    source
  });
};

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchPlatforms,
  fetchPortfolioItem
}, dispatch);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PortfolioItemDetail));
