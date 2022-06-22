import React, {
  useEffect,
  useState,
  Fragment,
  lazy,
  Suspense,
  useContext
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Switch, useRouteMatch, useLocation } from 'react-router-dom';
import { Grid, GridItem, Alert } from '@patternfly/react-core';
import { Section } from '@redhat-cloud-services/frontend-components/Section';

import ItemDetailInfoBar from './item-detail-info-bar';
import ItemDetailDescription from './item-detail-description';
import { PortfolioItemDetailToolbar } from './portfolio-item-detail-toolbar';
import TopToolbar from '../../../presentational-components/shared/top-toolbar';
import { getPortfolioItemDetail } from '../../../redux/actions/portfolio-actions';
import { getPortfolioItemDetail as getPortfolioItemDetailS } from '../../../redux/actions/portfolio-actions-s';
import {
  ProductLoaderPlaceholder,
  AppPlaceholder
} from '../../../presentational-components/shared/loader-placeholders';
import {
  uploadPortfolioItemIcon,
  resetPortfolioItemIcon
} from '../../../helpers/portfolio/portfolio-helper';
import {
  uploadPortfolioItemIcon as uploadPortfolioItemIconS,
  resetPortfolioItemIcon as resetPortfolioItemIconS
} from '../../../helpers/portfolio/portfolio-helper-s';
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
import { hasPermission, isStandalone } from '../../../helpers/shared/helpers';
import UserContext from '../../../user-context';

const SurveyEditor = lazy(() =>
  import(
    /* webpackChunkName: "survey-editor" */ '../../survey-editing/survey-editor'
  )
);

const SurveyEditorS = lazy(() =>
  import(
    /* webpackChunkName: "survey-editor-s" */ '../../survey-editing/survey-editor-s'
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
  const portfolioItemData = useSelector(
    ({ portfolioReducer: { portfolioItem } }) => portfolioItem
  );
  const portfolio = useSelector(
    ({ portfolioReducer: { selectedPortfolio } }) => selectedPortfolio
  );
  const fromProducts = queryValues['from-products'] === 'true';
  const { permissions: userPermissions } = useContext(UserContext);
  const canLinkOrderProcesses = hasPermission(userPermissions, [
    'catalog:order_processes:link'
  ]);

  const fetchData = (skipLoading) => {
    if (!skipLoading) {
      setIsFetching(true);
    }

    dispatch(
      isStandalone()
        ? getPortfolioItemDetailS({
            portfolioItem: queryValues['portfolio-item'],
            ...queryValues
          })
        : getPortfolioItemDetail({
            portfolioItem: queryValues['portfolio-item'],
            ...queryValues
          })
    )
      .then(() => setIsFetching(false))
      .catch(() => setIsFetching(false));
  };

  useEffect(() => {
    fetchData(false);
  }, [queryValues['portfolio-item']]);

  if (isFetching || Object.keys(portfolioItemData).length === 0) {
    return (
      <Section className="global-primary-background full-height">
        <TopToolbar breadcrumbs={!fromProducts}>
          {fromProducts && <BackToProducts />}
          <ProductLoaderPlaceholder />
        </TopToolbar>
      </Section>
    );
  }

  const availability = isStandalone()
    ? 'available'
    : portfolioItemData?.source?.availability_status || 'unavailable';
  let unavailable = [];

  if (portfolioItemData?.source) {
    unavailable = [portfolioItemData?.source]
      .filter(({ notFound }) => notFound)
      .map(({ object }) => (
        <Alert
          className="pf-u-mb-sm"
          key={object}
          variant="warning"
          isInline
          title={formatMessage(portfolioMessages.objectUnavaiable, {
            object
          })}
        />
      ));
  }

  const uploadIcon = (file) => {
    return (isStandalone()
      ? uploadPortfolioItemIconS({
          portfolioItemId: portfolioItemData?.portfolioItem?.id,
          icon_url: portfolioItemData?.portfolioItem?.icon_url,
          file
        })
      : uploadPortfolioItemIcon({
          portfolioItemId: portfolioItemData?.portfolioItem?.id,
          file
        })
    ).then(() => fetchData(true));
  };

  const resetIcon = () =>
    (isStandalone()
      ? resetPortfolioItemIconS(portfolioItemData?.portfolioItem?.id)
      : resetPortfolioItemIcon(portfolioItemData?.portfolioItem?.icon_id)
    ).then(fetchData);
  const detailPaths = [
    PORTFOLIO_ITEM_ROUTE,
    `${url}/order`,
    `${url}/copy`,
    `${url}/edit-workflow`,
    PORTFOLIO_ITEM_EDIT_ORDER_PROCESS_ROUTE
  ];
  const SurveyEditorComponent = isStandalone() ? SurveyEditorS : SurveyEditor;
  return (
    <Fragment>
      <Switch>
        <CatalogRoute
          requiredCapabilities="update"
          userCapabilities={
            portfolioItemData?.portfolioItem?.metadata?.user_capabilities
          }
          path={`${url}/edit-survey`}
        >
          <Suspense fallback={<AppPlaceholder />}>
            <SurveyEditorComponent
              closeUrl={url}
              search={search}
              uploadIcon={uploadIcon}
              portfolioItem={portfolioItemData.portfolioItem}
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
              product={portfolioItemData.portfolioItem}
              setOpen={setOpen}
              isFetching={isFetching}
              availability={availability}
              userCapabilities={
                portfolioItemData?.portfolioItem?.metadata?.user_capabilities
              }
              orderable={portfolioItemData?.portfolioItem.metadata?.orderable}
              canLinkOrderProcesses={canLinkOrderProcesses}
            />
            {unavailable.length > 0 && (
              <div className="pf-u-mr-lg pf-u-ml-lg">{unavailable}</div>
            )}
            {portfolioItemData?.source?.availability_status ===
              'unavailable' && (
              <Alert
                className="pf-u-ml-lg pf-u-mr-lg"
                id="unavailable-alert-info"
                variant="info"
                isInline
                title={formatMessage(portfolioMessages.sourceUnavaiable)}
              />
            )}
            <Section type="content">
              <Grid hasGutter className="pf-u-p-lg">
                <Route path={detailPaths} exact>
                  <GridItem md={3} lg={2}>
                    <ItemDetailInfoBar
                      product={portfolioItemData.portfolioItem}
                      portfolio={portfolio}
                      source={isStandalone() ? '1' : portfolioItemData.source}
                    />
                  </GridItem>
                </Route>
                <GridItem
                  md={pathname === PORTFOLIO_ITEM_ROUTE_EDIT ? 12 : 9}
                  lg={pathname === PORTFOLIO_ITEM_ROUTE_EDIT ? 12 : 10}
                >
                  <ItemDetailDescription
                    resetIcon={resetIcon}
                    uploadIcon={uploadIcon}
                    product={portfolioItemData.portfolioItem}
                    userCapabilities={
                      portfolioItemData?.portfolioItem?.metadata
                        ?.user_capabilities
                    }
                    url={url}
                    detailPaths={detailPaths}
                    search={search}
                  />
                </GridItem>
              </Grid>
            </Section>
          </Section>
        </Route>
      </Switch>
    </Fragment>
  );
};

export default PortfolioItemDetail;
