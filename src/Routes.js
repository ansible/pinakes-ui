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
const AddProviderForm = asyncComponent(() => import('./SmartComponents/Provider/AddProviderForm'));
const paths = {
    CatalogItemShow: '/catalog/catalogitems/:catalog_id',
    addprovider:  '/catalog/addprovider',
    catalogitems: '/catalog/catalogitems',
    orders: '/catalog/orders'
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
            <InsightsRoute exact path={paths.CatalogItemShow} component={CatalogItemShow} rootClass="catalogitems" />
            <InsightsRoute exact path={paths.catalogitems} component={CatalogItems} rootClass="catalogitems" />
            <InsightsRoute exact path={paths.orders} component={Orders} rootClass="catalogitems" />
            <InsightsRoute exact path={paths.addprovider} component={AddProviderForm} rootClass="addprovider" />
            {/* Finally, catch all unmatched routes */}
            <Route render={() => (some(paths, p => p === path) ? null : <Redirect to={paths.catalogitems} />)} />
        </Switch>
    );
};
