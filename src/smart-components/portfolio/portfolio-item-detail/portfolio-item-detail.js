import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, useRouteMatch } from 'react-router-dom';
import { Grid, GridItem } from '@patternfly/react-core';
import { Section } from '@redhat-cloud-services/frontend-components';

import OrderModal from '../../common/order-modal';
import ItemDetailInfoBar from './item-detail-info-bar';
import ItemDetailDescription from './item-detail-description';
import CopyPortfolioItemModal from './copy-portfolio-item-modal';
import PortfolioItemDetailToolbar from './portfolio-item-detail-toolbar';
import TopToolbar from '../../../presentational-components/shared/top-toolbar';
import { getPortfolioItemDetail } from '../../../redux/actions/portfolio-actions';
import { ProductLoaderPlaceholder } from '../../../presentational-components/shared/loader-placeholders';
import { uploadPortfolioItemIcon } from '../../../helpers/portfolio/portfolio-helper';
import useQuery from '../../../utilities/use-query';

const requiredParams = [ 'portfolio', 'source' ];

const PortfolioItemDetail = () => {
  const [ isOpen, setOpen ] = useState(false);
  const [ isFetching, setIsFetching ] = useState(true);
  const dispatch = useDispatch();
  const [ queryValues, search ] = useQuery(requiredParams);
  const { path, url, params: { portfolioItemId }} = useRouteMatch('/portfolios/detail/:id/product/:portfolioItemId');
  const {
    portfolioItem,
    portfolio
  } = useSelector(({ portfolioReducer: { portfolioItem }}) => portfolioItem);

  useEffect(() => {
    setIsFetching(true);
    dispatch(getPortfolioItemDetail({
      portfolioItem: portfolioItemId,
      ...queryValues
    }))
    .then(() => setIsFetching(false))
    .catch(() => setIsFetching(false));
  }, [ path ]);

  if (isFetching) {
    return (
      <Section style={ { backgroundColor: 'white', minHeight: '100%' } }>
        <TopToolbar>
          <ProductLoaderPlaceholder />
        </TopToolbar>
      </Section>
    );
  }

  const uploadIcon = file => uploadPortfolioItemIcon(portfolioItem.id, file);

  return (
    <Section style={ { backgroundColor: 'white', minHeight: '100%' } }>
      <Route path={ `${url}/order` } render={ props => <OrderModal search={ search } { ...props } closeUrl={ url } serviceData={ portfolioItem }/> }/>
      <Route
        path={ `${url}/copy` }
        render={ props => (
          <CopyPortfolioItemModal { ...props } search={ search }  portfolioItemId={ portfolioItem.id } portfolioId={ portfolio.id } closeUrl={ url }/>
        ) }
      />
      <PortfolioItemDetailToolbar
        uploadIcon={ uploadIcon }
        url={ url }
        search={ search }
        isOpen={ isOpen }
        product={ portfolioItem }
        setOpen={ setOpen }
        isFetching={ isFetching }
      />
      <div style={ { padding: 32 } }>
        <Grid>
          <GridItem md={ 2 }>
            <ItemDetailInfoBar product={ portfolioItem } portfolio={ portfolio } source={ portfolioItem } />
          </GridItem>
          <GridItem md={ 10 }>
            <ItemDetailDescription search={ search } product={ portfolioItem } url={ url } />
          </GridItem>
        </Grid>
      </div>
    </Section>
  );
};

export default PortfolioItemDetail;
