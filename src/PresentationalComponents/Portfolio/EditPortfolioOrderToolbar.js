import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import propTypes from 'prop-types';
import { Section, PageHeader, PageHeaderTitle } from '@red-hat-insights/insights-frontend-components';
import { Toolbar, ToolbarGroup, ToolbarItem, ToolbarSection, Dropdown, DropdownPosition,
    DropdownToggle, DropdownItem, KebabToggle, Title, Button } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import spacingStyles from '@patternfly/patternfly-next/utilities/Spacing/spacing.css';
import flexStyles from '@patternfly/patternfly-next/utilities/Flex/flex.css';
import '../../SmartComponents/Portfolio/portfolio.scss';

class PortfolioActionToolbar extends Component {

    state = {
        isKebabOpen: false
    };

    onKebabToggle = isOpen => {
        this.setState({
            isKebabOpen: isOpen
        });
    };

    buildPortfolioActionKebab = () => {
        const { isKebabOpen } = this.state;

        return (
            <Dropdown
                onToggle={ this.onKebabToggle }
                onSelect={ this.onKebabSelect }
                position={ DropdownPosition.right }
                toggle={ <KebabToggle onToggle={ this.onKebabToggle }/> }
                isOpen={ isKebabOpen }
                isPlain
            >
                <DropdownItem component="button">Add Products</DropdownItem>
                <DropdownItem component="button">Remove Products</DropdownItem>
            </Dropdown>
        );
    };

    render() {
        return (
            <Toolbar className={ css(flexStyles.justifyContentSpaceBetween, spacingStyles.mxXl, spacingStyles.myMd) }>
                <ToolbarGroup>
                    <ToolbarItem className={ css(spacingStyles.mrXl) }>
                        { this.props.title && <Title size={ '2xl' }> { this.props.title }</Title> }
                    </ToolbarItem>
                </ToolbarGroup>
                <ToolbarGroup className={ 'pf-u-ml-auto-on-xl' }>
                    <ToolbarItem className={ css(spacingStyles.mxLg) }>
                        <Button variant="plain" onClick={ this.props.onEditPortfolio(this.props) } aria-label="Edit Portfolio">
                            Edit Portfolio
                        </Button>
                    </ToolbarItem>
                    <ToolbarItem className={ css(spacingStyles.mxLg) }>
                        <Button variant="plain" aria-label="Remove Portfolio">
                            Remove Portfolio
                        </Button>
                    </ToolbarItem>
                    <ToolbarItem>
                        { this.buildPortfolioActionKebab() }
                    </ToolbarItem>
                </ToolbarGroup>
            </Toolbar>
        );
    }
}

PortfolioActionToolbar.propTypes = {
    history: propTypes.object,
    title: propTypes.string,
    onEditPortfolio: propTypes.func
};

export default withRouter(
    PortfolioActionToolbar);
