import React, { ReactNode } from 'react';

export const Bold = (chunks: ReactNode | ReactNode[]): ReactNode => (
  <b>{chunks}</b>
);
