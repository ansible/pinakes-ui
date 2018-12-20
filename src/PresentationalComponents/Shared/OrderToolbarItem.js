import React from 'react';
import { Section } from '@red-hat-insights/insights-frontend-components';
import { ToolbarGroup, ToolbarItem, Dropdown, DropdownPosition,
    DropdownToggle, DropdownItem, KebabToggle, Title, Button } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import spacingStyles from '@patternfly/patternfly-next/utilities/Spacing/spacing.css';
import '../../SmartComponents/Portfolio/portfolio.scss';

export default function OrderToolbarItem(props) {
    return (
        <ToolbarGroup className={ 'pf-u-ml-auto-on-xl' }>
            <ToolbarItem className={ css(spacingStyles.mrXL) }>
                <Button variant="link" id="ordersButton">
                    <i className="fas fa-shopping-cart" aria-hidden="true"></i>
                    Orders
                </Button>
            </ToolbarItem>
        </ToolbarGroup>
    );
};

