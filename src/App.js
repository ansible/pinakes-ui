import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Grid, GridItem } from '@patternfly/react-core';
import { Main } from '@redhat-cloud-services/frontend-components';
import { NotificationsPortal } from '@redhat-cloud-services/frontend-components-notifications/';

import { Routes } from './Routes';
import { MIN_SCREEN_HEIGHT } from './constants/ui-constants';
import { AppPlaceholder } from './presentational-components/shared/loader-placeholders';

import 'whatwg-fetch';
import smoothscroll from 'smoothscroll-polyfill';

import '@redhat-cloud-services/frontend-components-notifications/index.css';
import './App.scss';

smoothscroll.polyfill();
class App extends Component {
  state = {
    chromeNavAvailable: true,
    auth: false,
    ignoreRedirect: true
  }

  componentDidMount () {
    insights.chrome.init();
    insights.chrome.auth.getUser().then(() => this.setState({ auth: true }));
    try {
      insights.chrome.identifyApp('catalog');
      insights.chrome.navigation([{
        id: 'portfolios',
        title: 'Portfolios'
      }, {
        id: 'platforms',
        title: 'Platforms'
      }, {
        id: 'orders',
        title: 'Orders'
      }]);

      this.unregister = insights.chrome.on('APP_NAVIGATION', event => {
        /**
         * Handle navigation from insights main nav
         * Uses React history directly instead of browser history to avoid template realod.
         * only redirect after first application mount
         */
        if (!this.state.ignoreRedirect) {
          this.props.history.push(`/${event.navId}`);
        }

        this.setState({ ignoreRedirect: false });
      });
    } catch (error) {
      this.setState({
        chromeNavAvailable: false
      });
    }
  }

  componentWillUnmount () {
    this.unregister();
  }

  render () {
    const { auth } = this.state;
    if (!auth) {
      return <AppPlaceholder />;
    }

    return (
      <React.Fragment>
        <NotificationsPortal />
        <Main style={ { marginLeft: 0, padding: 0 } }>
          <Grid style={ { minHeight: MIN_SCREEN_HEIGHT } }>
            <GridItem sm={ 12 }>
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

export default withRouter(connect()(App));
