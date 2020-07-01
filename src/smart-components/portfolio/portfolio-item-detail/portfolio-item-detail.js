import React, { useEffect, useState, Fragment, lazy, Suspense } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { Grid, GridItem, Alert } from '@patternfly/react-core';
import { Section } from '@redhat-cloud-services/frontend-components/components/cjs/Section';

import ItemDetailInfoBar from './item-detail-info-bar';
import ItemDetailDescription from './item-detail-description';
import { PortfolioItemDetailToolbar } from './portfolio-item-detail-toolbar';
import TopToolbar from '../../../presentational-components/shared/top-toolbar';
import { getPortfolioItemDetail } from '../../../redux/actions/portfolio-actions';
import {
  ProductLoaderPlaceholder,
  AppPlaceholder
} from '../../../presentational-components/shared/loader-placeholders';
import { uploadPortfolioItemIcon } from '../../../helpers/portfolio/portfolio-helper';
import useQuery from '../../../utilities/use-query';
import { PORTFOLIO_ITEM_ROUTE } from '../../../constants/routes';
import CatalogRoute from '../../../routing/catalog-route';

const SurveyEditor = lazy(() =>
  import(
    /* webpackChunkName: "survey-editor" */ '../../survey-editing/survey-editor'
  )
);

const requiredParams = ['portfolio', 'source', 'portfolio-item'];

const PortfolioItemDetail = () => {
  const [isOpen, setOpen] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const dispatch = useDispatch();
  const [queryValues, search] = useQuery(requiredParams);
  const { url } = useRouteMatch(PORTFOLIO_ITEM_ROUTE);
  const {
    portfolioItem: {
      metadata: { user_capabilities: userCapabilities },
      ...portfolioItem
    },
    source
  } = useSelector(({ portfolioReducer: { portfolioItem } }) => portfolioItem);
  const portfolio = useSelector(
    ({ portfolioReducer: { selectedPortfolio } }) => selectedPortfolio
  );

  useEffect(() => {
    setIsFetching(true);
    dispatch(
      getPortfolioItemDetail({
        portfolioItem: queryValues['portfolio-item'],
        ...queryValues
      })
    )
      .then(() => setIsFetching(false))
      .catch(() => setIsFetching(false));
  }, [queryValues['portfolio-item']]);

  if (isFetching || Object.keys(portfolioItem).length === 0) {
    return (
      <Section className="global-primary-background full-height">
        <TopToolbar>
          <ProductLoaderPlaceholder />
        </TopToolbar>
      </Section>
    );
  }

  const availability = source.availability_status || 'unavailable';
  const unavailable = [source]
    .filter(({ notFound }) => notFound)
    .map(({ object }) => (
      <Alert
        className="pf-u-mb-sm"
        key={object}
        variant="warning"
        isInline
        title={`The ${object} for this product is no longer available`}
      />
    ));
  const uploadIcon = (file) => uploadPortfolioItemIcon(portfolioItem.id, file);
  return (
    <Fragment>
      <Switch>
        <CatalogRoute
          requiredCapabilities="update"
          userCapabilities={userCapabilities}
          path={`${url}/edit-survey`}
        >
          <Suspense fallback={<AppPlaceholder />}>
            <SurveyEditor
              closeUrl={url}
              search={search}
              uploadIcon={uploadIcon}
              portfolioItem={portfolioItem}
              portfolio={portfolio}
            />
          </Suspense>
        </CatalogRoute>
        <Route>
          <Section className="full-height global-primary-background">
            <PortfolioItemDetailToolbar
              uploadIcon={uploadIcon}
              url={url}
              isOpen={isOpen}
              product={portfolioItem}
              setOpen={setOpen}
              isFetching={isFetching}
              availability={availability}
              userCapabilities={userCapabilities}
            />
            {unavailable.length > 0 && (
              <div className="pf-u-mr-lg pf-u-ml-lg">{unavailable}</div>
            )}
            {source.availability_status === 'unavailable' && (
              <Alert
                className="pf-u-ml-lg pf-u-mr-lg"
                id="unavailable-alert-info"
                variant="info"
                isInline
                title="The platform for this product is unavailable"
              />
            )}
            <Grid hasGutter className="pf-u-p-lg">
              <GridItem md={3} lg={2}>
                <ItemDetailInfoBar
                  product={portfolioItem}
                  portfolio={portfolio}
                  source={source}
                />
              </GridItem>
              <GridItem md={9} lg={10}>
                <ItemDetailDescription
                  product={portfolioItem}
                  userCapabilities={userCapabilities}
                  url={url}
                  search={search}
                />
              </GridItem>
            </Grid>
          </Section>
        </Route>
      </Switch>
    </Fragment>
  );
};

export default PortfolioItemDetail;
