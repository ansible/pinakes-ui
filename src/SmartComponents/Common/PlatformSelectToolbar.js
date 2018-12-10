import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import propTypes from 'prop-types';
import { Section, Dropdown, DropdownItem, DropdownToggle, DropdownPosition } from '@red-hat-insights/insights-frontend-components';
import { Toolbar, ToolbarGroup, ToolbarItem, ToolbarSection, Title, Button } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import { fetchPlatforms } from '../../Store/Actions/PlatformActions';

import { parse } from 'querystring';

class PlatformSelectToolbar extends Component {
    state = {
        isOpen: false,
        isLoading: false
    };

    fetchData(apiProps) {
        this.props.fetchPlatforms({ ...apiProps });
    }

    componentDidMount() {
        this.fetchData();
    }

    onToggle = () => this.setState(prevState => ({ isOpen: !prevState.isOpen }));

    onSelect = (event) => this.setState(prevState => ({ isOpen: !prevState.isOpen }));

    dropdownPlatformItems() {
        if (!this.props.platforms) {
            return null;
        }

        let dropdownItems = [];
        this.props.platforms.map((platform) => {
            dropdownItems.push(
                <DropdownItem component="button" key={ platform.id }>{ platform.name }</DropdownItem>);
        });
        return dropdownItems;
    }

    render() {
        return (
            <ToolbarItem className={ 'pf-u-ml-sm pf-u-my-sm' }>
                <Dropdown
                    isOpen={ this.state.isOpen }
                    onSelect={ this.onSelect }
                    position={ DropdownPosition.left }
                    toggle={ <DropdownToggle onToggle={ this.onToggle }> All Platforms </DropdownToggle> }
                >
                    { !this.state.isLoading && this.dropdownPlatformItems() }
                </Dropdown>
            </ToolbarItem>);
    };

};

function mapStateToProps(state) {
    return {
        platforms: state.PlatformStore.platforms,
        isLoading: state.PlatformStore.isPlatformDataLoading
    };
}

const mapDispatchToProps = dispatch => {
    return {
        fetchPlatforms: apiProps => dispatch(fetchPlatforms(apiProps))
    };
};

PlatformSelectToolbar.propTypes = {
    platforms: propTypes.array,
    fetchPlatforms: propTypes.func,
    isLoading: propTypes.bool,
    searchFilter: propTypes.string,
    history: propTypes.object
};

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(PlatformSelectToolbar)
);
