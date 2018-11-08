import React, { Component } from 'react';
import asyncComponent from '../../Utilities/asyncComponent';

const PortalDashboard = asyncComponent(() => import('../ServicePortal/PortalDashboard'));

class ServicePortal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            filteredItems: []
        };
    }

    render() {
        return (
            <PortalDashboard />
        );
    }
}
export default ServicePortal;
