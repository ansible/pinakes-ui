import { Route, Switch, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import React from 'react';
import asyncComponent from './Utilities/asyncComponent';
import some from 'lodash/some';

/**
 * Aysnc imports of components
 *
 * https://webpack.js.org/guides/code-splitting/
 * https://reactjs.org/docs/code-splitting.html
 *
 * pros:
 *      1) code splitting
 *      2) can be used in server-side rendering
 * cons:
 *      1) naming chunk names adds unnecessary docs to code,
 *         see the difference with DashboardMap and InventoryDeployments.
 *
 */
const ServicePortal = asyncComponent(() => import('./SmartComponents/ServicePortal/ServicePortal'));
const PlatformItems = asyncComponent(() => import('./SmartComponents/Platform/PlatformItems'));
const PortfolioItems = asyncComponent(() => import('./SmartComponents/Portfolio/PortfolioItems'));
const CatalogItemShow = asyncComponent(() => import('./SmartComponents/CatalogItem/CatalogItem'));
const Orders = asyncComponent(() => import('./SmartComponents/Order/Orders'));
const AddPlatformForm = asyncComponent(() => import('./SmartComponents/AddPlatform/AddPlatformForm'));

const paths = {
    service_portal: '/service_portal',
    service_details: 'services/:catalog_id',
    addplatform:  '/addplatform',
    platform_items: '/platform_items/:filter?',
    portfolio_items: '/portfolio_items/:filter?',
    orders: '/orders',
    admin: '/admin'
};

type Props = {
    childProps: any
};

const InsightsRoute = ({ component: Component, rootClass, ...rest }) => {
    const root = document.getElementById('root');
    root.removeAttribute('class');
    root.classList.add(`page__${rootClass}`, 'pf-l-page__main');
    root.setAttribute('role', 'main');

    return (<Component { ...rest } />);
};

InsightsRoute.propTypes = {
    component: PropTypes.func,
    rootClass: PropTypes.string
};

/**
 * the Switch component changes routes depending on the path.
 *
 * Route properties:
 *      exact - path must match exactly,
 *      path - https://prod.foo.redhat.com:1337/insights/advisor/rules
 *      component - component to be rendered when a route has been chosen.
 */
export const Routes = (props: Props) => {
  const path = props.childProps.location.pathname;
  return (
    <Switch>
        <InsightsRoute exact path={paths.service_portal} component={ServicePortal} rootClass="admin" />
        <InsightsRoute exact path={paths.platform_items} component={PlatformItems} rootClass="platform_items" />
        <InsightsRoute exact path={paths.portfolio_items} component={PortfolioItems} rootClass="portfolio_items" />
        <InsightsRoute exact path={paths.orders} component={Orders} rootClass="admin" />
        <InsightsRoute exact path={paths.service_details} component={CatalogItemShow} rootClass="admin" />
        <InsightsRoute exact path={paths.addplatform} component={AddPlatformForm} rootClass="admin" />
        {/* Finally, catch all unmatched routes */}
        <Route render={() => (some(paths, p => p === path) ? null : <Redirect to={paths.service_portal} />)} />
    </Switch>
  );
};
