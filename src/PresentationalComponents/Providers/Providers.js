import React from 'react';
import { Route, Switch } from 'react-router-dom';
import asyncComponent from '../../Utilities/asyncComponent';

const ListProviders = asyncComponent(() => import(/* webpackChunkName: "ListProviders" */ './ListProviders'));
const ViewProvider = asyncComponent(() => import(/* webpackChunkName: "ListProviders" */ './ViewProvider'));

const Providers = () => {
    return (
        <React.Fragment>
            <h1>Providers</h1>
            <Switch>
                <Route exact path='/catalog/providers' component={ListProviders} />
                <Route path='/catalog/providers/:id' component={ViewProvider} />
            </Switch>
        </React.Fragment>
    );
};

export default Providers;
