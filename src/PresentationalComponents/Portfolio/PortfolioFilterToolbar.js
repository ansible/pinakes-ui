import React, { Component } from 'react';
import { Section } from '@red-hat-insights/insights-frontend-components';
import { Toolbar, ToolbarGroup, ToolbarItem, TolbarSection, Title, Button, TextInput } from '@patternfly/react-core';
import OrderToolbarItem from '../Shared/OrderToolbarItem';
import FilterToolbarItem from '../Shared/FilterToolbarItem';
import '../Shared/toolbarschema.scss';

class PortfolioFilterToolbar extends Component {
    render() {
        return (
            <Toolbar style={ { backgroundColor: '#FFFFFF' } }>
                <FilterToolbarItem { ...this.props } placeholder={'Find a Product'}/>
                <OrderToolbarItem { ...this.props }/>
            </Toolbar>);
    };
};

export default PortfolioFilterToolbar;
