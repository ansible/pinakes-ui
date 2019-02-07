import React from 'react';
import { ToolbarSection } from '@patternfly/react-core';
import TopToolbar from '../Shared/top-toolbar';
import OrderToolbarItem from '../Shared/OrderToolbarItem';
import FilterToolbarItem from '../Shared/FilterToolbarItem';
import '../Shared/toolbarschema.scss';

const PortfolioFilterToolbar = props => (
  <TopToolbar paddingBottom>
    <ToolbarSection>
      <FilterToolbarItem { ...props } placeholder={ 'Find a Product' }/>
      <OrderToolbarItem { ...props }/>
    </ToolbarSection>
  </TopToolbar>
);

export default PortfolioFilterToolbar;
