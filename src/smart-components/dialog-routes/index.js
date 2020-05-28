import React, { Suspense, Fragment } from 'react';
import PortfolioRoutes from './portfolio-routes';
import PlatformRoutes from './platform-routes';

const DialogRoutes = () => (
  <Suspense fallback={Fragment}>
    <PortfolioRoutes />
    <PlatformRoutes />
  </Suspense>
);

export default DialogRoutes;
