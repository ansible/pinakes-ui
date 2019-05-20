import React from 'react';
import { Title } from '@patternfly/react-core';
import { Main } from '@redhat-cloud-services/frontend-components';

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

