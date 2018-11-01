import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import propTypes from 'prop-types';
import { parse } from 'querystring';
import { Section } from '@red-hat-insights/insights-frontend-components';
import { Toolbar, ToolbarGroup, ToolbarItem, ToolbarSection } from '@patternfly/react-core';
import ContentGallery from '../../SmartComponents/ContentGallery/ContentGallery';
import { fetchPortfolioItems, fetchPortfolioItemsWithPortfolio } from '../../Store/Actions/PortfolioActions';
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
            <Section>
                <ContentGallery {...filteredItems} />
                <MainModal />
            </Section>
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
