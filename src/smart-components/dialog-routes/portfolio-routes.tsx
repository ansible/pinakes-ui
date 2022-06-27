import React, { lazy, useEffect } from 'react';
import { Switch, Route, useLocation } from 'react-router-dom';
import {
  ADD_PORTFOLIO_ROUTE,
  EDIT_PORTFOLIO_ROUTE,
  PORTFOLIOS_ROUTE,
  NESTED_EDIT_PORTFOLIO_ROUTE,
  PORTFOLIO_ROUTE,
  REMOVE_PORTFOLIO_ROUTE,
  NESTED_REMOVE_PORTFOLIO_ROUTE,
  SHARE_PORTFOLIO_ROUTE,
  NESTED_SHARE_PORTFOLIO_ROUTE,
  WORKFLOW_PORTFOLIO_ROUTE,
  NESTED_WORKFLOW_PORTFOLIO_ROUTE,
  PORTFOLIO_ITEM_ROUTE,
  NESTED_EDIT_ORDER_PROCESS_ROUTE,
  EDIT_ORDER_PROCESS_ROUTE
} from '../../constants/routes';
import useInitialUriHash from '../../routing/use-initial-uri-hash';
import CatalogRoute from '../../routing/catalog-route';
import useQuery from '../../utilities/use-query';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { PORTFOLIO_RESOURCE_TYPE } from '../../utilities/constants';
import {
  setOrFetchPortfolio,
  resetSelectedPortfolio,
  fetchPortfolios
} from '../../redux/actions/portfolio-actions';
import {
  setOrFetchPortfolio as setOrFetchPortfolioS,
  fetchPortfolios as fetchPortfoliosS
} from '../../redux/actions/portfolio-actions-s';

import SetOrderProcessModal from '../order-process/set-order-process-modal';
import { CatalogRootState } from '../../types/redux';
import {
  ApiCollectionResponse,
  InternalPortfolioItem,
  UserCapabilities
} from '../../types/common-types';
import { Portfolio } from '@redhat-cloud-services/catalog-client';
import { isStandalone } from '../../helpers/shared/helpers';

const CopyPortfolioItemModal = lazy(() =>
  import(
    /* webpackChunkName: "copy-portfolio-item-modal" */ '../portfolio/portfolio-item-detail/copy-portfolio-item-modal'
  )
);

const OrderModal = lazy(() =>
  import(/* webpackChunkName: "order-modal" */ '../common/order-modal')
);

const EditApprovalWorkflow = lazy(() =>
  import(
    /* webpackChunkName: "edit-approval-workflow" */ '../common/edit-approval-workflow'
  )
);
const SharePortfolioModal = lazy(() =>
  import(
    /* webpackChunkName: "share-portfolio" */ '../portfolio/share-portfolio-modal'
  )
);

const RemovePortfolioModal = lazy(() =>
  import(
    /* webpackChunkName: "remove-portfolio" */ '../portfolio/remove-portfolio-modal'
  )
);

const AddPortfolioModal = lazy(() =>
  import(
    /* webpackChunkName: "add-portfolio" */ '../portfolio/add-portfolio-modal'
  )
);

const PortfolioRoutes: React.ComponentType = () => {
  const viewState = useInitialUriHash();
  const { pathname } = useLocation();

  const portfolioItemId = useSelector<CatalogRootState, string | undefined>(
    (state) => state?.portfolioReducer?.portfolioItem?.portfolioItem?.id
  );
  const portfolioItemUserCapabilities = useSelector<
    CatalogRootState,
    UserCapabilities | undefined
  >((state) => {
    const portfolioItem =
      state?.portfolioReducer?.portfolioItem?.portfolioItem || {};
    return (portfolioItem as InternalPortfolioItem).metadata?.user_capabilities;
  }, shallowEqual);

  const portfolios = useSelector<
    CatalogRootState,
    ApiCollectionResponse<Portfolio>
  >((state) => state?.portfolioReducer?.portfolios, shallowEqual);

  const selectedPortfolio = useSelector<
    CatalogRootState,
    Portfolio | undefined
  >((state) => state?.portfolioReducer?.selectedPortfolio, shallowEqual);

  const { portfolioUserCapabilities, itemName } = useSelector<
    CatalogRootState,
    {
      portfolioUserCapabilities: UserCapabilities;
      itemName: () => string | undefined;
    }
  >((state) => ({
    portfolioUserCapabilities:
      state?.portfolioReducer?.selectedPortfolio?.metadata?.user_capabilities,
    itemName: () => state?.portfolioReducer?.selectedPortfolio?.name
  }));

  const [{ portfolio: id }, search] = useQuery(['portfolio']);
  const dispatch = useDispatch();

  useEffect(() => {
    if (id && (!selectedPortfolio?.id || id !== selectedPortfolio.id)) {
      dispatch(
        isStandalone()
          ? setOrFetchPortfolioS(id, portfolios)
          : setOrFetchPortfolio(id, portfolios)
      );
    }
  }, [id]);

  return (
    <div>
      <Switch>
        <Route path={[ADD_PORTFOLIO_ROUTE, EDIT_PORTFOLIO_ROUTE]}>
          <AddPortfolioModal
            removeQuery={false}
            viewState={viewState?.portfolio}
            closeTarget={PORTFOLIOS_ROUTE}
          />
        </Route>
        <CatalogRoute
          userCapabilities={portfolioUserCapabilities}
          requiredCapabilities="update"
          exact
          path={NESTED_EDIT_PORTFOLIO_ROUTE}
        >
          <AddPortfolioModal
            closeTarget={{ pathname: PORTFOLIO_ROUTE, search }}
          />
        </CatalogRoute>
        <Route path={REMOVE_PORTFOLIO_ROUTE}>
          <RemovePortfolioModal viewState={viewState?.portfolio} />
        </Route>
        <CatalogRoute
          userCapabilities={portfolioUserCapabilities}
          requiredCapabilities="destroy"
          exact
          path={NESTED_REMOVE_PORTFOLIO_ROUTE}
        >
          <RemovePortfolioModal />
        </CatalogRoute>
        <Route exact path={SHARE_PORTFOLIO_ROUTE}>
          <SharePortfolioModal
            closeUrl={PORTFOLIOS_ROUTE}
            removeSearch
            viewState={viewState?.portfolio}
            portfolioName={itemName}
          />
        </Route>
        <Route exact path={NESTED_SHARE_PORTFOLIO_ROUTE}>
          <SharePortfolioModal
            closeUrl={PORTFOLIO_ROUTE}
            portfolioName={itemName}
          />
        </Route>
        <Route exact path={WORKFLOW_PORTFOLIO_ROUTE}>
          <EditApprovalWorkflow
            pushParam={{ pathname: PORTFOLIOS_ROUTE }}
            objectType={PORTFOLIO_RESOURCE_TYPE}
            objectName={itemName}
            querySelector="portfolio"
            removeSearch
            keepHash
            postMethod={() =>
              isStandalone() ? fetchPortfoliosS() : fetchPortfolios()
            }
            onClose={() => dispatch(resetSelectedPortfolio())}
          />
        </Route>
        <Route exact path={NESTED_WORKFLOW_PORTFOLIO_ROUTE}>
          <EditApprovalWorkflow
            querySelector="portfolio"
            pushParam={{ pathname: PORTFOLIO_ROUTE, search }}
            objectType={PORTFOLIO_RESOURCE_TYPE}
            objectName={itemName}
          />
        </Route>
        <Route exact path={`${PORTFOLIO_ITEM_ROUTE}/order`}>
          <OrderModal closeUrl={PORTFOLIO_ITEM_ROUTE} />
        </Route>
        <Route
          exact
          path={[EDIT_ORDER_PROCESS_ROUTE, NESTED_EDIT_ORDER_PROCESS_ROUTE]}
        >
          <SetOrderProcessModal
            querySelector="portfolio"
            objectType={PORTFOLIO_RESOURCE_TYPE}
            objectName={itemName}
            pushParam={{
              pathname:
                pathname === EDIT_ORDER_PROCESS_ROUTE
                  ? PORTFOLIOS_ROUTE
                  : PORTFOLIO_ROUTE,
              search:
                pathname === NESTED_EDIT_ORDER_PROCESS_ROUTE
                  ? search
                  : undefined
            }}
          />
        </Route>

        <CatalogRoute
          path={`${PORTFOLIO_ITEM_ROUTE}/copy`}
          requiredCapabilities="copy"
          userCapabilities={portfolioItemUserCapabilities}
        >
          {portfolioItemId && (
            <CopyPortfolioItemModal
              portfolioName={itemName()}
              search={search}
              portfolioItemId={portfolioItemId}
              portfolioId={id}
              closeUrl={PORTFOLIO_ITEM_ROUTE}
            />
          )}
        </CatalogRoute>
      </Switch>
    </div>
  );
};

export default PortfolioRoutes;
