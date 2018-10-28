import React from 'react';
import propTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Main } from '@red-hat-insights/insights-frontend-components';
import { Nav, NavList, NavGroup, NavItem } from '@patternfly/react-core';
import {bindMethods} from "../../Helpers/Shared/Helper";
import { fetchPlatforms } from '../../Store/Actions/PlatformActions';
import { fetchPortfolios } from "../../Store/Actions/PortfolioActions";


class PortalNav extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeItem: 0
        };
    };

    componentDidMount() {
        this.fetchData();
        bindMethods(this, ['onSelect']);
    }

    fetchData() {
    // TODO - only call if the user is an admin
        this.props.fetchPlatforms();
        this.props.fetchPortfolios();
    }

    platformNavItems() {
        return (
            this.props.platforms.map(item => {
                let itemLink=`/insights/platform/service_portal/platform_items/platform=${item.id}?`;
                return (<NavItem to={itemLink} key={item.id}
                    isActive={this.state.activeItem === item.id}>
                    {item.name}
                </NavItem>);})
        );
    };

    portfolioNavItems() {
        return (
            this.props.portfolios.map(item => {
                let itemLink=`/insights/platform/service_portal/portfolio_items/portfolio=${item.id}?`;
                return (<NavItem to={itemLink} key={item.id}
                    isActive={this.state.activeItem === item.id}>
                    {item.name}
                </NavItem>);})
        );
    };

    onSelect(result) {
        this.setState({
            activeItem: result.itemId
        });
    };

    render() {
        return (
            <Nav onSelect={this.onSelect} aria-label="Service Portal">
                <NavGroup title="Platforms">
                    { !this.props.isPlatformDataLoading &&
              this.platformNavItems()}
                </NavGroup>
                <NavGroup title="Portfolios">
                    <NavItem to="/insights/platform/service_portal/portfolio_items" key="allPortfolios" isActive={this.state.activeItem === 'allPortfolios'}>
              All Portfolios
                    </NavItem>
                    { !this.props.isLoading && this.portfolioNavItems()}
                </NavGroup>
            </Nav>
        );
    }
}

function mapStateToProps(state) {
    return {
        isPlatformDataLoading: state.PlatformStore.isPlatformDataLoading,
        platforms: state.PlatformStore.platforms,
        isLoading: state.PortfolioStore.isLoading,
        portfolios: state.PortfolioStore.portfolios,

    };
}

const mapDispatchToProps = dispatch => {
    return {
        fetchPlatforms: () => dispatch(fetchPlatforms()),
        fetchPortfolios: () => dispatch(fetchPortfolios()),
    };
};


PortalNav.propTypes = {
    portfolios: propTypes.array,
    platforms: propTypes.array,
    isPlatformDataLoading: propTypes.bool,
    isLoading: propTypes.bool,
    history: propTypes.object,
};

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(PortalNav)
);
