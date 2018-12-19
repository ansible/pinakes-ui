import React, { Component } from 'react';
import propTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Section, PageHeader, PageHeaderTitle } from '@red-hat-insights/insights-frontend-components';
import { Toolbar, ToolbarGroup, ToolbarItem, ToolbarSection, Dropdown, DropdownPosition,
    DropdownToggle, DropdownItem, KebabToggle, Title, Button } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import spacingStyles from '@patternfly/patternfly-next/utilities/Spacing/spacing.css';
import flexStyles from '@patternfly/patternfly-next/utilities/Flex/flex.css';
import '../../SmartComponents/Portfolio/portfolio.scss';

class PortfolioOrderToolbar extends Component {
    render() {
        return (
            <Toolbar className={ css(flexStyles.justifyContentSpaceBetween, spacingStyles.mxXl, spacingStyles.myMd) } style={ { backgroundColor: '#FFFFFF' } }>
                <ToolbarGroup>
                    <ToolbarItem className={ css(spacingStyles.mrXl) }>
                        { this.props.title && <Title size={ '2xl' }> { this.props.title }</Title> }
                    </ToolbarItem>
                </ToolbarGroup>
                <ToolbarGroup className={ 'pf-u-ml-auto-on-xl' }>
                    <ToolbarItem className={ css(spacingStyles.mrXL) }>
                        <Button variant="link" id="ordersButton">
                            <i className="fas fa-shopping-cart" aria-hidden="true"></i>
                            Orders
                        </Button>
                    </ToolbarItem>
                </ToolbarGroup>
            </Toolbar>
        );
    }
}

PortfolioOrderToolbar.propTypes = {
    history: propTypes.object,
    title: propTypes.string
};

export default withRouter(PortfolioOrderToolbar);

