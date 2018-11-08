import React from 'react';
import propTypes from 'prop-types';
import { withRouter, NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindMethods } from '../../Helpers/Shared/Helper';
import { Nav, NavGroup, NavItem } from '@patternfly/react-core';
import { fetchPlatforms } from '../../Store/Actions/PlatformActions';
import { fetchPortfolios } from '../../Store/Actions/PortfolioActions';
import { toggleEdit } from '../../Store/Actions/UiActions';
import { PencilAltIcon } from '@patternfly/react-icons';
import './portalnav.scss';

const PORTFOLIO_ITEMS_URL = '/portfolio_items';
const PLATFORM_ITEM_URL_BASE = `/platform_items/platform=`;
const PORTFOLIO_ITEM_URL_BASE = `/portfolio_items/portfolio=`;


class PortalNav extends React.Component {
    state = {
        activeItem: null,
        activeGroup: 'platforms',
        isEditing: false
    };

    componentDidMount() {
        this.fetchData();
        bindMethods(this, [ 'onSelect' ]);
    }

    fetchData() {
    // TODO - only call if the user is an admin
        this.props.fetchPlatforms();
        this.props.fetchPortfolios();
    }

    platformNavItems = () => this.props.platforms.map(item => (
        <NavItem
            key={ item.id }
            itemId={ item.id }
            groupId="platforms"
            activeClassName="pf-m-current"
        >
            <NavLink to={ PLATFORM_ITEM_URL_BASE + `${item.id}` }>
                { item.name }
            </NavLink>
        </NavItem>
    ));

    portfolioNavItems = () => this.props.portfolios.map(item => (
        <NavItem
            key={ item.id }
            itemId={ item.id }
            groupId="portfolios"
            isActive={ this.state.activeItem === item.id && this.state.activeGroup === 'portfolios' }
            className="portalnav"
        >
            <NavLink to={ PORTFOLIO_ITEM_URL_BASE + `${item.id}` } activeClassName="pf-m-current">
                { item.name }
                <span
                    onClick={ this.props.toggleEdit }
                    className={ this.props.location.pathname === PORTFOLIO_ITEM_URL_BASE + `${item.id}` ? '' : 'editable-item' }
                    style={ { float: 'right' } }
                >
                    { '' }Edit
                    <PencilAltIcon />
                </span>
            </NavLink>
        </NavItem>
    ));

    onSelect = ({ itemId, groupId }) => this.setState({
        activeItem: itemId,
        activeGroup: groupId
    });

    render() {
        return (
            <Nav onSelect={ this.onSelect } aria-label="Service Portal">
                <NavGroup title="Platforms">
                    { !this.props.isPlatformDataLoading && this.platformNavItems() }
                </NavGroup>
                <NavGroup title="Portfolios">
                    <NavItem className="portalnav" groupId="portfolios">
                        <NavLink key="allPortfolios" exact to= { PORTFOLIO_ITEMS_URL } activeClassName="pf-m-current">
                            All Portfolios
                        </NavLink>
                    </NavItem>
                    { !this.props.isLoading && this.portfolioNavItems() }
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
        portfolios: state.PortfolioStore.portfolios

    };
}

const mapDispatchToProps = dispatch => {
    return {
        fetchPlatforms: () => dispatch(fetchPlatforms()),
        fetchPortfolios: () => dispatch(fetchPortfolios()),
        toggleEdit: () => dispatch(toggleEdit())
    };
};

PortalNav.propTypes = {
    portfolios: propTypes.array,
    platforms: propTypes.array,
    isPlatformDataLoading: propTypes.bool,
    fetchPortfolios: propTypes.func,
    fetchPlatforms: propTypes.func,
    toggleEdit: propTypes.func,
    isLoading: propTypes.bool,
    location: propTypes.object,
    history: propTypes.object
};

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(PortalNav)
);
