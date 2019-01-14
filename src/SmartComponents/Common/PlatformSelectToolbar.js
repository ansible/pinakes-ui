import React, { Component } from 'react';
import { connect } from 'react-redux';
import propTypes from 'prop-types';
import { Toolbar, ToolbarGroup, ToolbarItem } from '@patternfly/react-core';
import Select from 'react-select';
import '../../PresentationalComponents/Platform/platform.scss';
import FilterToolbarItem from '../../PresentationalComponents/Shared/FilterToolbarItem';

class PlatformSelectToolbar extends Component {
    state = {
      searchValue: '',
      selectedOption: '',
      arrayValue: []
    };

    selectMultipleOption = options => this.setState(
      { selected: options },
      () => this.props.onOptionSelect(options)
    );

    render() {
      const { platforms } = this.props;
      const dropdownItems = platforms.map(platform => ({ value: platform.id, label: platform.name, id: platform.id }));

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
                  closeMenuOnSelect={ false }
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
  isLoading: propTypes.bool,
  searchFilter: propTypes.string,
  onOptionSelect: propTypes.func,
  onSearchClick: propTypes.func
};

export default connect(mapStateToProps)(PlatformSelectToolbar);
