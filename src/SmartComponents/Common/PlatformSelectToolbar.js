import React, { Component } from 'react';
import { connect } from 'react-redux';
import propTypes from 'prop-types';
import { Toolbar, ToolbarGroup, ToolbarItem } from '@patternfly/react-core';
import Select from 'react-select';
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
    }

    onInputChange = () => {
    }

    onSearchSubmit = () => {
      this.props.hasOwnProperty('onSearchClick') && this.props.onSearchClick(this.state.searchValue, this.state.selected);
    };

    render() {
      const { platforms } = this.props;
      const dropdownItems = platforms.map(platform => ({ value: platform.id, label: platform.name }));

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

const mapStateToProps = ({ platformReducer: { platforms, isPlatformDataLoading }}) => ({
  platforms,
  isLoading: isPlatformDataLoading
});

PlatformSelectToolbar.propTypes = {
  platforms: propTypes.array,
  fetchPlatforms: propTypes.func,
  isLoading: propTypes.bool,
  searchFilter: propTypes.string,
  onOptionSelect: propTypes.func,
  onSearchClick: propTypes.func
};

export default connect(mapStateToProps)(PlatformSelectToolbar);
