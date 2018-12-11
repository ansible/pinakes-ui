import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Section } from '@red-hat-insights/insights-frontend-components';
import { Toolbar, ToolbarGroup, ToolbarItem, TolbarSection, Title, Button} from '@patternfly/react-core';
import '../../SmartComponents/Portfolio/portfolio.scss';
import { css } from '@patternfly/react-styles';

class EditPortfolioTitleToolbar extends Component {
    state = {
        searchValue: ''
    };

    render() {
        return (
            <Toolbar style={ { backgroundColor: '#FFFFFF' } }>
                <ToolbarGroup className={ 'pf-u-ml-on-md' }>
                    <ToolbarItem className={ 'pf-u-ml-sm pf-u-my-sm' }>
                        <div className="pf-c-input-group">
                            <input className="pf-c-form-control" input="true" type="text" id="searchItem"
                                   name="searchPlatformItems" placeholder="Filter..."
                                   aria-label="filter input with platform button"></input>
                            <Button variant="tertiary" id="filterPlatformButton">
                                <i className="fas fa-search" aria-hidden="true"></i>
                            </Button>
                        </div>
                    </ToolbarItem>
                </ToolbarGroup>
            </Toolbar>);
    };
};

export default withRouter(EditPortfolioTitleToolbar;
