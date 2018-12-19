import React, { Component } from 'react';
import { Section } from '@red-hat-insights/insights-frontend-components';
import { Toolbar, ToolbarGroup, ToolbarItem, TolbarSection, Title, Button, TextInput } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import OrderToolbarItem from '../Shared/OrderToolbarItem';
import FilterToolbarItem from '../Shared/FilterToolbarItem';
import '../Shared/toolbarschema.scss';

class PortfoliosFilterToolbar extends Component {
    render() {
        return (
            <Toolbar className="searchToolbar">
                <FilterToolbarItem { ...this.props } placeholder={ 'Find a Portfolio' }/>
                <OrderToolbarItem { ...this.props }/>
            </Toolbar>);
    };
};

export default PortfoliosFilterToolbar;
