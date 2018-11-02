import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Routes } from './Routes';
import './App.scss';
import Alerts from './SmartComponents/Common/Alerts';
import Portal from './PresentationalComponents/Portal/Portal';
import PortalNav from './SmartComponents/ServicePortal/PortalNav';
import { Main } from '@red-hat-insights/insights-frontend-components';
import { Grid, GridItem } from '@patternfly/react-core';

class App extends Component {

    componentDidMount () {
        insights.chrome.init();
        insights.chrome.identifyApp('service-portal');
        insights.chrome.navigation(buildNavigation());

        this.appNav = insights.chrome.on('APP_NAVIGATION', event => this.props.history.push(`/${event.navId}`));
        this.buildNav = this.props.history.listen(() => insights.chrome.navigation(buildNavigation()));
    }

    componentWillUnmount () {
        this.appNav();
        this.buildNav();
    }

    render () {
        return (
            <React.Fragment>
                <Portal><Alerts /></Portal>
                <Main style={ { marginLeft: 0, paddingLeft: 0, paddingTop: 0 } }>
                    <Grid>
                        <GridItem sm={ 4 } md={ 4 } lg={ 2 } xl={ 2 }>
                            <PortalNav />
                        </GridItem >
                        <GridItem sm={ 8 } md={ 8 } lg={ 10 } xl={ 10 }>
                            <Routes childProps={ this.props } />
                        </GridItem>
                    </Grid>
                </Main>
            </React.Fragment>
        );
    }
}

App.propTypes = {
    history: PropTypes.object
};

/**
 * withRouter: https://reacttraining.com/react-router/web/api/withRouter
 * connect: https://github.com/reactjs/react-redux/blob/master/docs/api.md
 *          https://reactjs.org/docs/higher-order-components.html
 */
export default withRouter (connect()(App));

function buildNavigation () {
    const currentPath = window.location.pathname.split('/').slice(-1)[0];
    return [];
}
