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
 *      1) nameing chunk names adds unnecessary docs to code,
 *         see the difference with DashboardMap and InventoryDeployments.
 *
 */
const CatalogItems = asyncComponent(() => import('./SmartComponents/CatalogItem/CatalogItems'));
const CatalogItemShow = asyncComponent(() => import('./SmartComponents/CatalogItem/CatalogItem'));
const Orders = asyncComponent(() => import('./SmartComponents/Order/Orders'));
const AddPlatformForm = asyncComponent(() => import('./SmartComponents/Platform/AddPlatformForm'));
const paths = {
    service_details: '/service_portal/services/:catalog_id',
    addplatform:  '/service_portal/addplatform',
    services: '/service_portal/services',
    orders: '/service_portal/orders'
};

type Props = {
    childProps: any
};

const InsightsRoute = ({ component: Component, rootClass, ...rest }) => {
    const root = document.getElementById('root');
    root.removeAttribute('class');
    root.classList.add(`page__${rootClass}`, 'pf-l-page__main');

    return (<Component {...rest} />);
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
            <InsightsRoute exact path={paths.service_details} component={CatalogItemShow} rootClass="service_details" />
            <InsightsRoute exact path={paths.services} component={CatalogItems} rootClass="services" />
            <InsightsRoute exact path={paths.orders} component={Orders} rootClass="orders" />
            <InsightsRoute exact path={paths.addplatform} component={AddPlatformForm} rootClass="addplatform" />
            {/* Finally, catch all unmatched routes */}
            <Route render={() => (some(paths, p => p === path) ? null : <Redirect to={paths.services} />)} />
        </Switch>
    );
};
