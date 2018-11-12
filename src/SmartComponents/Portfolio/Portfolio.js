import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import propTypes from 'prop-types';
import { Section } from '@red-hat-insights/insights-frontend-components';
import { Toolbar, ToolbarGroup, ToolbarItem, ToolbarSection, PageHeader } from '@patternfly/react-core';
import ContentGallery from '../../SmartComponents/ContentGallery/ContentGallery';
import { fetchPortfolio, fetchPortfolioItemsWithPortfolio } from '../../Store/Actions/PortfolioActions';
import { consoleLog } from '../../Helpers/Shared/Helper';
import MainModal from '../Common/MainModal';
import './portfolioitems.scss';

class Portfolio extends Component {
    constructor(props) {
        super(props);
        this.state = {
            portfolioId: '',
            portfolioName: '',
            showItems: '',
            filteredItems: []
        };
        consoleLog('Portfolio props: ', props);
    }

    fetchData(apiProps) {
        this.props.fetchPortfolio(apiProps.portfolioId);
        this.props.fetchPortfolioItemsWithPortfolio(apiProps.portfolioId);
    }

    componentDidMount() {
        let portfolioId = this.props.computedMatch.params.filter;
        consoleLog('PortfolioItems filter: ', portfolioId);
        this.fetchData(portfolioId);
    }

    portfolioToolbar() {
        return (
            <Toolbar style={ { backgroundColor: '#ffffff', marginLeft: '8px', paddingBottom: '10px', paddingLeft: '20px' } }>
                <ToolbarSection>
                    <ToolbarGroup>
                        <ToolbarItem>{ this.state.portfolioName }</ToolbarItem>
                    </ToolbarGroup>
                    <ToolbarGroup>
                        <ToolbarItem>Add Products</ToolbarItem>
                        <ToolbarItem>Remove Products</ToolbarItem>
                        <ToolbarItem>|</ToolbarItem>
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
                <PageHeader portfolio_name={ this.state.portfolio.name }/>
                { this.portfolioToolbar() }
                <ContentGallery { ...filteredItems } />
                <MainModal />
            </Section>
        );
    }
}

function mapStateToProps(state) {
    return {
        portfolio: state.PortfolioStore.selectedPortfolio,
        portfolioItems: state.PortfolioStore.portfolioItems,
        isLoading: state.PortfolioStore.isLoading,
        searchFilter: state.PortfolioStore.filterValue
    };
}

const mapDispatchToProps = dispatch => {
    return {
        fetchPortfolioItemsWithPortfolio: apiProps => dispatch(fetchPortfolioItemsWithPortfolio(apiProps)),
        fetchPortfolio: apiProps => dispatch(fetchPortfolio(apiProps))
    };
};

Portfolio.propTypes = {
    filteredItems: propTypes.object,
    isLoading: propTypes.bool,
    searchFilter: propTypes.string,
    history: propTypes.object
};

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(Portfolio)
);
