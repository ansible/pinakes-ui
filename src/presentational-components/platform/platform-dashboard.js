import React from 'react';
import { Title } from '@patternfly/react-core';
import { Main } from '@red-hat-insights/insights-frontend-components';

const PlatformDashboard = () =>(
  <Main>
    <div style={ { textAlign: 'center' } }>
      <Title size="md">
        Search Or Select a Platform
      </Title>
    </div>
  </Main>
);

export default PlatformDashboard;

