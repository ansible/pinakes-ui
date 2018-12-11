import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import propTypes from 'prop-types';
import { Section, Input } from '@red-hat-insights/insights-frontend-components';
import { Toolbar, ToolbarGroup, ToolbarItem, ToolbarSection, Title, Button, ButtonVariant,
    Dropdown, DropdownItem, DropdownToggle, DropdownPosition } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import { fetchPlatforms } from '../../Store/Actions/PlatformActions';

class PlatformSelectToolbar extends Component {
    state = {
        isOpen: false,
        searchValue: ''
    };

    onToggle = () => { this.setState(prevState => ({ isOpen: !prevState.isOpen }));};

    onSelect = (event) => {
        const { platforms } = this.props;
        this.setState({
            isOpen: false,
            selected: platforms.find(oneItem => oneItem.value === event.target.getAttribute('data-key'))
        });
        this.fetchData({ platform: this.state.selected });
        this.props.onOptionSelect && this.props.onOptionSelect(event);
    }

    onSearchSubmit = () => {
        this.props.hasOwnProperty('onSearchClick') && this.props.onSearchClick(this.state.searchValue, this.state.selected);
    };

    render() {
        const {
            platforms,
            ...props
        } = this.props;
        const placeholder = 'Find a product';
        const { isOpen, selected } = this.state;
        const dropdownItems = platforms.map(platform =>
            <DropdownItem key={ platform.id } data-key={ platform.id }>{ platform.name }</DropdownItem>
        );
        return (
            <Toolbar style={ { backgroundColor: '#FFFFFF' } }>
                <ToolbarGroup className={ 'pf-u-ml-on-md' }>
                    <ToolbarItem className={ 'pf-u-ml-sm pf-u-my-sm' }>
                        <div className="pf-c-input-group">
                            <Input placeholder={ placeholder } onChange={ this.onInputChange }
                                aria-label="Find product button"></Input>
                            <Button variant="tertiary" id="searchProductButton" onClick={ this.onSearchSubmit }>
                                <i className="fas fa-search" aria-hidden="true"></i>
                            </Button>
                        </div>
                    </ToolbarItem>
                    <ToolbarItem className={ 'pf-u-ml-sm pf-u-my-sm' }>
                        { platforms &&
                        <Dropdown
                            onSelect={ this.onSelect }
                            isOpen={ isOpen }
                            toggle={
                                <DropdownToggle onToggle={ this.onToggle }>
                                    { (selected && selected.name) || platforms.name || 'Filter by Platform' }
                                </DropdownToggle>
                            }
                            dropdownItems={ dropdownItems }
                        /> }
                    </ToolbarItem>
                </ToolbarGroup>
            </Toolbar>);
    };

};

function mapStateToProps(state) {
    return {
        platforms: state.PlatformStore.platforms,
        isLoading: state.PlatformStore.isPlatformDataLoading
    };
}

PlatformSelectToolbar.propTypes = {
    platforms: propTypes.array,
    fetchPlatforms: propTypes.func,
    isLoading: propTypes.bool,
    searchFilter: propTypes.string,
    history: propTypes.object,
    onOptionSelect: propTypes.func,
    onSearchClick: propTypes.func
};

export default withRouter(
    connect(
        mapStateToProps,
        null
    )(PlatformSelectToolbar)
);
