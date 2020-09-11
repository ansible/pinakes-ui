/* eslint-disable react/prop-types */
import React, { HTMLProps } from 'react';
import clsx from 'clsx';

const BottomPaginationContainer: React.ComponentType<HTMLProps<
  HTMLDivElement
>> = ({ children, className, ...props }) => (
  <div
    className={clsx(
      'pf-u-p-lg pf-u-pt-md pf-u-pb-md global-primary-background pf-u-mt-auto',
      className
    )}
    {...props}
  >
    {children}
  </div>
);

export default BottomPaginationContainer;
