import React, { Component } from 'react';
import propTypes from 'prop-types';
import { Section } from '@red-hat-insights/insights-frontend-components';
import { Toolbar, ToolbarGroup, ToolbarItem, DropdownToggle, DropdownItem, Dropdown, DropdownPosition, KebabToggle, Title, Button } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import spacingStyles from '@patternfly/patternfly-next/utilities/Spacing/spacing.css';
import flexStyles from '@patternfly/patternfly-next/utilities/Flex/flex.css';
import '../../SmartComponents/Portfolio/portfolio.scss';

class AddProductsTitleToolbar extends Component {
    render() {
        return (
            <Toolbar className={ css(flexStyles.justifyContentSpaceBetween, spacingStyles.mxXl, spacingStyles.myMd) } style={ { backgroundColor: '#FFFFFF' } }>
                <ToolbarGroup>
                    <ToolbarItem className={ css(spacingStyles.mrXl) }>
                        { this.props.title &&  (<Title size={ '2xl' }> { 'Add Products: ' + this.props.title }</Title>) }
                    </ToolbarItem>
                </ToolbarGroup>
                <ToolbarGroup className={ 'pf-u-ml-auto-on-xl' }>
                    <ToolbarItem className={ css(spacingStyles.mxLg) }>
                        <Button variant="link" aria-label="Cancel Add Products to Portfolio" onClick={ this.props.onClickCancelAddProducts }>
                            Cancel
                        </Button>
                    </ToolbarItem>
                    <ToolbarItem className={ css(spacingStyles.mxLg) } >
                        <Button variant="plain" aria-label="Add Products to Portfolio" onClick={ this.props.onClickAddToPortfolio }>
                            Add
                        </Button>
                    </ToolbarItem>
                </ToolbarGroup>
            </Toolbar>
        );
    }
}

AddProductsTitleToolbar.propTypes = {
    history: propTypes.object,
    title: propTypes.string,
    onClickAddToPortfolio: propTypes.func,
    onClickCancelAddProducts: propTypes.func
};

export default AddProductsTitleToolbar;

