import React, { Suspense, Fragment } from 'react';
import PortfolioRoutes from './portfolio-routes';

const DialogRoutes = () => (
  <Suspense fallback={Fragment}>
    <PortfolioRoutes />
  </Suspense>
);

export default DialogRoutes;
