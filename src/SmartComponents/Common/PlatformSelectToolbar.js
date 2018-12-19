import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import propTypes from 'prop-types';
import { Section, Input } from '@red-hat-insights/insights-frontend-components';
import { Toolbar, ToolbarGroup, ToolbarItem, ToolbarSection, Title, Button, ButtonVariant, TextInput } from '@patternfly/react-core';
import Select from 'react-select';
import { consoleLog } from '../../Helpers/Shared/Helper';
import '../../PresentationalComponents/Platform/platform.scss';
import FilterToolbarItem from '../../PresentationalComponents/Shared/FilterToolbarItem';

class PlatformSelectToolbar extends Component {
    state = {
        isOpen: false,
        searchValue: '',
        selectedOption: '',
        arrayValue: []
    };

    selectMultipleOption = (options) => {
        consoleLog('Select Multiple Platforms: ', options);
        const { platforms } = this.props;
        let selectedValues = [];
        options.map((option) => {selectedValues.push(platforms.find(oneItem => oneItem.id === option.value));});
        this.setState({
            isOpen: false,
            selected: selectedValues
        });
        this.props.onOptionSelect && this.props.onOptionSelect(selectedValues);
    }

    onMenuClose = () => {
        consoleLog('Menu Closed!!!!');
    }

    onInputChange = () => {
        consoleLog('Search Value changed');
    }

    onSearchSubmit = (event) => {
        this.props.hasOwnProperty('onSearchClick') && this.props.onSearchClick(this.state.searchValue, this.state.selected);
    };

    render() {
        const {
            platforms,
            ...props
        } = this.props;

        const { value } = this.state.searchValue;
        const placeholder = 'Find a product';
        const { isOpen, selected } = this.state;
        const dropdownItems = platforms.map(function (platform) { return { value: platform.id, label: platform.name }; });

        return (
            <Toolbar className="searchToolbar">
                <FilterToolbarItem/>
                <ToolbarGroup className="searchPlatforms">
                    <ToolbarItem>
                        { platforms &&
                        <Select
                            isMulti={ true }
                            placeholder={ 'Filter by Platform' }
                            options={ dropdownItems }
                            onChange={ this.selectMultipleOption }
                            onMenuClose={ this.onMenuClose }
                            closeMenuOnSelect={ true }
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
