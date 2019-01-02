import React from 'react';
import propTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Nav, NavGroup, NavItem } from '@patternfly/react-core';
import { fetchPlatforms } from '../../redux/Actions/PlatformActions';
import { fetchPortfolios } from '../../redux/Actions/PortfolioActions';
import { toggleEdit } from '../../redux/Actions/UiActions';
import './portalnav.scss';

const ALL_PORTFOLIOS_URL = '/portfolios';
const PLATFORM_ITEM_URL_BASE = '/platform_items';
const PORTFOLIO_URL_BASE = '/portfolios';

class PortalNav extends React.Component {
    state = {
      activeItem: null,
      activeGroup: 'platforms',
      isEditing: false
    };

    componentDidMount() {
      this.fetchData();
    }

    fetchData = () => {
    // TODO - only call if the user is an admin
      this.props.fetchPlatforms();
      this.props.fetchPortfolios();
    }

    platformNavItems = () => {
      if (this.props.platforms) {
        return this.props.platforms.map(item => (
          <NavLink key={ item.id } to={ `${PLATFORM_ITEM_URL_BASE}/${item.id}` }>
            <NavItem
              itemId={ item.id }
              groupId="platforms"
            >
              { item.name }
            </NavItem>
          </NavLink>
        ));
      }
      else {
        return null;
      }
    };

    portfolioNavItems = () => {
      if (this.props.portfolios) {
        return this.props.portfolios.map(item => (
          <NavLink key={ item.id } to={ `${PORTFOLIO_URL_BASE}/${item.id}` }>
            <NavItem
              groupId="portfolios"
            >
              { item.name }
            </NavItem>
          </NavLink>
        ));
      } else {
        return null;
      }
    };

    onSelect = ({ itemId, groupId }) => this.setState({
      activeItem: itemId,
      activeGroup: groupId
    });

    render() {
      return <Nav onSelect= { this.onSelect } aria-label="Service Portal">
        <NavGroup title="Platforms">
          { !this.props.isPlatformDataLoading && this.platformNavItems() }
        </NavGroup>
        <NavGroup title="Portfolios">
          <NavLink to={ ALL_PORTFOLIOS_URL }>
            <NavItem
              key='all'
              groupId="portfolios"
            >
                        All Portfolios
            </NavItem>
          </NavLink>
          { !this.props.isLoading && this.portfolioNavItems() }
        </NavGroup>
      </Nav>;
    }
}

const mapStateToProps = ({
  platformReducer: { platforms, isPlatformDataLoading },
  portfolioReducer: { isLoading, portfolios }
}) => ({
  isPlatformDataLoading,
  platforms,
  isLoading,
  portfolios
});

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchPlatforms,
  fetchPortfolios,
  toggleEdit
}, dispatch);

PortalNav.propTypes = {
  portfolios: propTypes.array,
  platforms: propTypes.array,
  isPlatformDataLoading: propTypes.bool,
  fetchPortfolios: propTypes.func,
  fetchPlatforms: propTypes.func,
  toggleEdit: propTypes.func,
  isLoading: propTypes.bool
};

export default connect(mapStateToProps, mapDispatchToProps)(PortalNav);
