import React, { Component } from 'react';
import { Toolbar, ToolbarGroup, ToolbarItem, Button } from '@patternfly/react-core';

/**
 * TODO Use PF4 input components
 */
class PlatformToolbar extends Component {
    state = {
      searchValue: ''
    };

    render() {
      return (
        <Toolbar style={ { backgroundColor: '#FFFFFF' } }>
          <ToolbarGroup className={ 'pf-u-ml-on-md' }>
            <ToolbarItem className={ 'pf-u-ml-sm pf-u-my-sm' }>
              <div className="pf-c-input-group">
                <input className="pf-c-form-control"
                  input="true" type="text" id="searchItem"
                  name="searchPlatformItems"
                  placeholder="Filter..."
                  aria-label="filter input with platform button"
                />
                <Button variant="tertiary" id="filterPlatformButton">
                  <i className="fas fa-search" aria-hidden="true"></i>
                </Button>
              </div>
            </ToolbarItem>
          </ToolbarGroup>
        </Toolbar>);
    };
};

export default PlatformToolbar;
