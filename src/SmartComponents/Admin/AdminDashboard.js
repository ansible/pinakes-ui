import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import propTypes from 'prop-types';
import { PageHeader, PageHeaderTitle, Main, Section } from '@red-hat-insights/insights-frontend-components';
import ContentGallery from 'SmartComponents/ContentGallery/ContentGallery';
import MainModal from '../Common/MainModal';
import { fetchPortfolios, fetchPortfolioItems, searchPortfolioItems } from 'Store/Actions/PortfolioActions';
import {bindMethods} from "../../Helpers/Shared/Helper";
import { Grid, GridItem, Toolbar, ToolbarGroup, ToolbarItem, ToolbarSection } from '@patternfly/react-core';
import './admindashboard.scss'

class AdminDashboard extends Component {
  constructor(props) {
      super(props);
      this.state = {
          showItems: '',
          filteredItems: []
      };
  }

  fetchData(apiProps) {
    this.props.fetchPlatformItems({...apiProps });
    this.props.fetchPortfolioItems({...apiProps });
    this.props.fetchPortfolios({...apiProps });
  }


  componentDidMount() {
    this.fetchData();
    bindMethods(this, ['onNavClick', 'handleOnPlatformClick', 'handleOnPortfolioClick']);
  }

  onNavClick()
  {

  }

  platformLink(platform){
    return(
    <li className="pf-c-nav__item" onClick={ () => {this.handleOnPlatformClick(itemsForPlatform(platform))}}>
      <a href="#" className="pf-c-nav__link" aria-current="page">
        {platform.name}
      </a>
    </li>
    )
  }

  portfolioLink(portfolio){
    return(
    <li className="pf-c-nav__item" onClick={ () => {this.handleOnPortfolioClick(itemsForPortfolio(portfolio))}}>
      <a href="#" className="pf-c-nav__link" aria-current="page">
        {portfolio.name}
      </a>
    </li>
    )
  }

  renderToolbar() {
    return(
      <Toolbar style={{backgroundColor: '#ffffff', marginLeft: '8px', paddingBottom: '10px', paddingLeft: '20px'}}>
        <ToolbarSection>
          <ToolbarGroup>
            <ToolbarItem>Select Platform</ToolbarItem>
          </ToolbarGroup>
          <ToolbarGroup>
            <ToolbarItem>Search</ToolbarItem>
            <ToolbarItem>Sort</ToolbarItem>
          </ToolbarGroup>
        </ToolbarSection>
      </Toolbar>);
  }

  handleOnPlatformClick() {
    console.log('Changing display items');
    this.setState({showItems: 'platform'});
    this.props.fetchPlatformItems();
  }

  handleOnPortfolioClick() {
    console.log('Changing display items');
    this.setState({showItems: 'portfolio'});
    this.props.fetchPortfolioItems();
  }

  renderNav() {
    return(
    <div style={{backgroundColor: '#ffffff', minHeight: '2000px'}}>
      <nav className="pf-c-nav " aria-label="Service Portal Admin">
        <section className="pf-c-nav__section" aria-labelledby={"platform-group"} >
          <h2 className="pf-c-nav__section-title" id="platform-group">
            Platforms
          </h2>
          <ul className="pf-c-nav__simple-list">
            {this.platformLinks()}
          </ul>
        </section>
        <section className="pf-c-nav__section" aria-labelledby="portfolios">
          <h2 className="pf-c-nav__section-title" id="portfolios">
            Portfolios
          </h2>
          <ul className="pf-c-nav__simple-list">
            {this.portfolioLinks()}
          </ul>
        </section>
        <section className="pf-c-nav__section" aria-labelledby="filters">
          <h2 className="pf-c-nav__section-title" id="filters">
            Filters
          </h2>
          <ul className="pf-c-nav__simple-list">
            <li className="pf-c-nav__item">
              <a href="#" className="pf-c-nav__link pf-m-current" aria-current="page">
                Favorites
              </a>
            </li>
          </ul>
        </section>
      </nav>
    </div>);
  }

  render() {
    let displayItems = [];
    if( this.state.showItems == 'platform') {
      displayItems = this.props.platformItems.platformItems;
    }
    else if ( this.state.showItems == 'portfolio') {
      displayItems = this.props.portfolioItems.portfolioItems;
    }

    let filteredItems = {
        items: displayItems,
        isLoading: this.props.isLoading
    };
    return (
      <Main style={{marginLeft: 0, paddingLeft:0, paddingTop: 0}}>
        { this.renderToolbar() }
        <Grid>
          <GridItem sm={2} md={2} lg={2} xl={2}>
            {this.renderNav()}
          </GridItem >

          <GridItem sm={10} md={10} lg={10} xl={10}>
            <ContentGallery {...filteredItems} />
          </GridItem>
        </Grid>
        <MainModal />
      </Main>
    );
  }
}

function mapStateToProps(state) {
  return {
    platformItems: state.PortfolioStore.platformItems,
    portfolioItems: state.PortfolioStore.portfolioItems,
    portfolios: state.PortfolioStore.portfolios,
    platforms: state.PortfolioStore.platforms,
    isLoading: state.PortfolioStore.isLoading,
    searchFilter: state.PortfolioStore.filterValue
  };
}

const mapDispatchToProps = dispatch => {
    return {
      fetchPortfolios: apiProps => dispatch(fetchPortfolios(apiProps)),
      fetchPlatformItems: apiProps => dispatch(fetchPlatformItems(apiProps)),
      fetchPortfolioItems: apiProps => dispatch(fetchPortfolioItems(apiProps)),
      search: value => dispatch(searchPortfolioItems(value))
    };
};

AdminDashboard.propTypes = {
    filteredItems: propTypes.object,
    portfolioItems: propTypes.object,
    portfolios: propTypes.array,
    platforms: propTypes.object,
    isLoading: propTypes.bool,
    searchFilter: propTypes.string,
    history: propTypes.object,
    fetchPortfolioItems: propTypes.func,
    searchPortfolioItems: propTypes.func
};

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(AdminDashboard)
);
