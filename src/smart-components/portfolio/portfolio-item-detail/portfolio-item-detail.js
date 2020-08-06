import React, { useEffect, useState, Fragment, lazy, Suspense } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Switch, useRouteMatch, useLocation } from 'react-router-dom';
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
import {
  PORTFOLIO_ITEM_ROUTE,
  PORTFOLIO_ITEM_ROUTE_EDIT,
  PORTFOLIO_ITEM_EDIT_ORDER_PROCESS_ROUTE
} from '../../../constants/routes';
import CatalogRoute from '../../../routing/catalog-route';
import portfolioMessages from '../../../messages/portfolio.messages';
import BackToProducts from '../../../presentational-components/portfolio/back-to-products';
import useFormatMessage from '../../../utilities/use-format-message';

const SurveyEditor = lazy(() =>
  import(
    /* webpackChunkName: "survey-editor" */ '../../survey-editing/survey-editor'
  )
);

const requiredParams = [
  'portfolio',
  'source',
  'portfolio-item',
  'from-products'
];

const PortfolioItemDetail = () => {
  const formatMessage = useFormatMessage();
  const [isOpen, setOpen] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const dispatch = useDispatch();
  const [queryValues, search] = useQuery(requiredParams);
  const { pathname } = useLocation();
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
  const fromProducts = queryValues['from-products'] === 'true';

  useEffect(() => {
    setIsFetching(true);
    insights.chrome.appNavClick({
      id: fromProducts ? 'products' : 'portfolios',
      secondaryNav: true
    });
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
        <TopToolbar breadcrumbs={!fromProducts}>
          {fromProducts && <BackToProducts />}
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
        title={formatMessage(portfolioMessages.objectUnavaiable, { object })}
      />
    ));
  const uploadIcon = (file) => uploadPortfolioItemIcon(portfolioItem.id, file);
  const detailPaths = [
    PORTFOLIO_ITEM_ROUTE,
    `${url}/order`,
    `${url}/copy`,
    `${url}/edit-workflow`,
    PORTFOLIO_ITEM_EDIT_ORDER_PROCESS_ROUTE
  ];
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
              fromProducts={fromProducts}
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
                title={formatMessage(portfolioMessages.sourceUnavaiable)}
              />
            )}
            <Grid hasGutter className="pf-u-p-lg">
              <Route path={detailPaths} exact>
                <GridItem md={3} lg={2}>
                  <ItemDetailInfoBar
                    product={portfolioItem}
                    portfolio={portfolio}
                    source={source}
                  />
                </GridItem>
              </Route>
              <GridItem
                md={pathname === PORTFOLIO_ITEM_ROUTE_EDIT ? 12 : 9}
                lg={pathname === PORTFOLIO_ITEM_ROUTE_EDIT ? 12 : 10}
              >
                <ItemDetailDescription
                  uploadIcon={uploadIcon}
                  product={portfolioItem}
                  userCapabilities={userCapabilities}
                  url={url}
                  detailPaths={detailPaths}
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
