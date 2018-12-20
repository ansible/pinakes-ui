import React, { Component } from 'react';
import propTypes from 'prop-types';
import { ToolbarGroup, ToolbarItem, Button, TextInput } from '@patternfly/react-core';

class FilterToolbarItem extends Component {
    state = {
      searchValue: ''
    };

    render() {
      const { searchValue } = this.state;
      return (
        <ToolbarGroup className="searchToolbar">
          <ToolbarItem>
            <div className="pf-c-input-group">
              <TextInput placeholder={ this.props.placeholder } value={ searchValue } type="text" onChange={ this.props.onFilterChange }
                aria-label="Find product button"></TextInput>
              <Button variant="tertiary" id="searchProductButton" onClick={ this.onSearchSubmit }>
                <i className="fas fa-search" aria-hidden="true"></i>
              </Button>
            </div>
          </ToolbarItem>
        </ToolbarGroup>);
    };
};

FilterToolbarItem.propTypes = {
  history: propTypes.object,
  onFilterChange: propTypes.func,
  placeholder: propTypes.string
};

export default FilterToolbarItem;

