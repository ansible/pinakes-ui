import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import { Grid, GridItem } from '@patternfly/react-core';
import { Section } from '@red-hat-insights/insights-frontend-components';

import OrderModal from '../../Common/OrderModal';
import ItemDetailInfoBar from './item-detail-info-bar';
import { allowNull } from '../../../Helpers/Shared/helpers';
import ItemDetailDescription from './item-detail-description';
import { fetchPlatforms } from '../../../redux/Actions/PlatformActions';
import { fetchWorkflows } from '../../../redux/Actions/approval-actions';
import PortfolioItemDetailToolbar from './portfolio-item-detail-toolbar';
import TopToolbar from '../../../PresentationalComponents/Shared/top-toolbar';
import { updatePortfolioItem } from '../../../Helpers/Portfolio/PortfolioHelper';
import { fetchPortfolioItem, selectPortfolioItem } from '../../../redux/Actions/PortfolioActions';
import { ProductLoaderPlaceholder } from '../../../PresentationalComponents/Shared/LoaderPlaceholders';

const PortfolioItemDetail = ({
  match: { path, url, params: { portfolioItemId }},
  history: { push },
  source,
  product,
  portfolio,
  isLoading,
  workflows,
  fetchWorkflows,
  fetchPlatforms,
  fetchPortfolioItem,
  selectPortfolioItem
}) => {
  const [ isOpen, setOpen ] = useState(false);
  const [ workflow, setWorkflow ] = useState(product.workflow_ref);
  useEffect(() => {
    fetchWorkflows();
  }, []);
  useEffect(() => {
    fetchPlatforms();
    fetchPortfolioItem(portfolioItemId);
  }, [ path ]);

  useEffect(() => {
    setWorkflow(product.workflow_ref);
  }, [ isLoading ]);

  const handleUpdate = () => {
    updatePortfolioItem({ ...product, workflow_ref: workflow }).then(updatedItem => selectPortfolioItem(updatedItem.json())).then(() => push(url));
  };

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
      <PortfolioItemDetailToolbar
        url={ url }
        isOpen={ isOpen }
        product={ product }
        setOpen={ setOpen }
        handleUpdate={ handleUpdate }
        setWorkflow={ setWorkflow }
      />
      <div style={ { padding: 32 } }>
        <Grid>
          <GridItem md={ 2 }>
            <ItemDetailInfoBar product={ product } portfolio={ portfolio } source={ source } />
          </GridItem>
          <GridItem md={ 10 }>
            <ItemDetailDescription product={ product } url={ url } workflows={ workflows } workflow={ workflow } setWorkflow={ setWorkflow }  />
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
  workflows: PropTypes.arrayOf(PropTypes.shape({
    value: allowNull(PropTypes.string),
    label: PropTypes.string.isRequired
  })).isRequired,
  isLoading: PropTypes.bool,
  fetchPlatforms: PropTypes.func.isRequired,
  fetchPortfolioItem: PropTypes.func.isRequired,
  fetchWorkflows: PropTypes.func.isRequired,
  selectPortfolioItem: PropTypes.func.isRequired
};

const mapStateToProps = ({
  portfolioReducer: { portfolioItem, isLoading, selectedPortfolio },
  platformReducer: { platforms },
  approvalReducer: { workflows, isFetching }
}) => {
  const portfolio = selectedPortfolio;
  const product = portfolioItem;
  let source;

  if (product && platforms) {
    source = platforms.find(item => item.id == product.service_offering_source_ref); // eslint-disable-line eqeqeq
  }

  return ({
    isLoading: isLoading || !product || !portfolio || !source || isFetching,
    workflows,
    portfolio,
    product,
    source
  });
};

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchPlatforms,
  fetchPortfolioItem,
  fetchWorkflows,
  selectPortfolioItem
}, dispatch);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PortfolioItemDetail));
