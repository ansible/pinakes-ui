import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Button, Title, Bullseye } from '@patternfly/react-core';
import { Main } from '@red-hat-insights/insights-frontend-components';

class PlatformDashboard extends Component {
    render() {
        return (
            <Main>
                <div style={ { textAlign: 'center' } }>
                    <Title size="md">
                        Search Or Select a Platform
                    </Title>
                </div>
                <div style={ { textAlign: 'center' } }>
                    <Button variant="secondary" type="button">Take Action</Button>
                </div>
            </Main>
        );
    }
}

export default withRouter(PlatformDashboard);

