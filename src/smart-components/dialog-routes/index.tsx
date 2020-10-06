import React, { Suspense } from 'react';
import PortfolioRoutes from './portfolio-routes';
import PlatformRoutes from './platform-routes';

const DialogRoutes = () => (
  <Suspense fallback={<div></div>}>
    <PortfolioRoutes />
    <PlatformRoutes />
  </Suspense>
);

export default DialogRoutes;
