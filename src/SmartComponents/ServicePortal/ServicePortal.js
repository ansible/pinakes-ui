import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, Redirect, Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import some from 'lodash/some';
import propTypes from 'prop-types';
import { PageHeader, PageHeaderTitle, Main, Section } from '@red-hat-insights/insights-frontend-components';
import {bindMethods} from "../../Helpers/Shared/Helper";
import asyncComponent from "../../Utilities/asyncComponent";
import { Grid, GridItem, Toolbar, ToolbarGroup, ToolbarItem, ToolbarSection } from '@patternfly/react-core';
import { fetchPortfolios } from 'Store/Actions/PortfolioActions';
import { fetchPlatforms } from 'Store/Actions/PlatformActions';
import PortalNav from '../ServicePortal/PortalNav';
import MainModal from '../Common/MainModal';

const PortalDashboard = asyncComponent(() => import('../ServicePortal/PortalDashboard'));
const PlatformItems= asyncComponent(() => import('../Platform/PlatformItems'));
const PortfolioItems = asyncComponent(() => import('../Portfolio/PortfolioItems'));

export const paths = {
  portalDashboard: '/insights/service_portal/',
  platformItems: '/insights/service_portal/platform_items',
  portfolioItems: '/insights/service_portal/portfolio_items'
};


class ServicePortal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filteredItems: []
    };
  }

  render() {
    let path = this.props.location.pathname;
    return (
        <React.Fragment>
          <PageHeader>
            <PageHeaderTitle title="Service Portal"/>
          </PageHeader>
          <BrowserRouter>
            <Main style={{marginLeft: 0, paddingLeft:0, paddingTop: 0}}>
              <Grid>
                <GridItem sm={2} md={2} lg={2} xl={2}>
                  <PortalNav />
                </GridItem >
                <GridItem sm={10} md={10} lg={10} xl={10}>
                  <Switch>
                    <Route exact path={paths.platformItems} component={PlatformItems} />
                    <Route exact path={paths.portfolioItems} component={PortfolioItems} />
                    <Route exact path={paths.portalDashboard} component={PortalDashboard} />
                    <Route
                        render={() => (some(paths, p => p === path) ? null : <Redirect to={paths.portalDashboard}/>)}
                    />
                  </Switch>
                </GridItem>
              </Grid>
              <MainModal />
            </Main>
          </BrowserRouter>
        </React.Fragment>
    );
  }

}

 function mapStateToProps(state) {
    return {
      isLoading: state.PortfolioStore.isLoading,
      searchFilter: state.PortfolioStore.filterValue
    }
  }
  ServicePortal.propTypes = {
  isLoading: propTypes.bool,
  searchFilter: propTypes.string,
};

export default connect(
        mapStateToProps,
        null
    )(ServicePortal);
