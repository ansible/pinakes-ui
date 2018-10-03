import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import propTypes from 'prop-types';
import { parse } from 'querystring';
import { PageHeader, PageHeaderTitle, Main, Section } from '@red-hat-insights/insights-frontend-components';
import ContentGallery from 'SmartComponents/ContentGallery/ContentGallery';
import { fetchPortfolioItems, fetchPortfolioItemsWithPortfolio } from 'Store/Actions/PortfolioActions';
import { Grid, GridItem, Toolbar, ToolbarGroup, ToolbarItem, ToolbarSection } from '@patternfly/react-core';
import PortalNav from '../ServicePortal/PortalNav'
import MainModal from '../Common/MainModal';
import './portfolioitems.scss'


class PortfolioItems extends Component {
  constructor(props) {
      super(props);
      this.state = {
          showItems: '',
          filteredItems: []
      };
      console.log('PortfolioItems props: ', props)
  }

  fetchData(apiProps) {
    if (apiProps && apiProps.portfolio) {
      this.props.fetchPortfolioItemsWithPortfolio(apiProps.portfolio);
    }
    else {
      this.props.fetchPortfolioItems({...apiProps});
    }
  }

  componentDidMount() {
    let filter = this.props.computedMatch.params.filter;
    console.log('PortfolioItems filter: ', filter);
    let parsed = parse(filter);
    console.log('PortfolioItems parsed filter: ', parsed);
    this.fetchData(parsed);
  }

  renderToolbar() {
    return(
      <Toolbar style={{backgroundColor: '#ffffff', marginLeft: '8px', paddingBottom: '10px', paddingLeft: '20px'}}>
        <ToolbarSection>
          <ToolbarGroup>
            <ToolbarItem>Select Portfolio</ToolbarItem>
          </ToolbarGroup>
          <ToolbarGroup>
            <ToolbarItem>Search</ToolbarItem>
            <ToolbarItem>Sort</ToolbarItem>
          </ToolbarGroup>
        </ToolbarSection>
      </Toolbar>
    );
  }

  render() {
    let filteredItems = {
        items: this.props.portfolioItems.portfolioItems,
        isLoading: this.props.isLoading
    };
    return (
      <Main style={{marginLeft: 0, paddingLeft:0, paddingTop: 0}}>
        <Grid>
          <GridItem sm={2} md={2} lg={2} xl={2}>
            <PortalNav />
          </GridItem >
          <GridItem sm={10} md={10} lg={10} xl={10}>
              <GridItem sm={10} md={10} lg={10} xl={10}>
                <ContentGallery {...filteredItems} />
              </GridItem>
          </GridItem>
        </Grid>
        <MainModal />
      </Main>
    );
  }
}

function mapStateToProps(state) {
  return {
    portfolioItems: state.PortfolioStore.portfolioItems,
    isLoading: state.PortfolioStore.isLoading,
    searchFilter: state.PortfolioStore.filterValue
  };
}

const mapDispatchToProps = dispatch => {
    return {
      fetchPortfolioItems: apiProps => dispatch(fetchPortfolioItems(apiProps)),
      fetchPortfolioItemsWithPortfolio: apiProps => dispatch(fetchPortfolioItemsWithPortfolio(apiProps)),
      search: value => dispatch(searchPortfolioItems(value))
    };
};

PortfolioItems.propTypes = {
    filteredItems: propTypes.object,
    isLoading: propTypes.bool,
    searchFilter: propTypes.string,
    history: propTypes.object,
};

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(PortfolioItems)
);
