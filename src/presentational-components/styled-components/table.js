import React from 'react';

import PropTypes from 'prop-types';
import clsx from 'clsx';
import styled from 'styled-components';

const childrenPropType = PropTypes.oneOfType([
  PropTypes.node,
  PropTypes.arrayOf(PropTypes.node)
]);

export const Table = ({ children, className, ...props }) => (
  <table className={clsx('pf-c-table', 'pf-m-grid-md', className)} {...props}>
    {children}
  </table>
);

Table.propTypes = {
  children: childrenPropType.isRequired,
  className: PropTypes.string
};

export const Tbody = ({ children, ...props }) => (
  <tbody {...props}>{children}</tbody>
);

Tbody.propTypes = {
  children: childrenPropType.isRequired
};

export const TableCell = styled(({ shrink, children, ...props }) => (
  <td {...props}>{children}</td>
))`
  @media screen and (min-width: 768px) {
    vertical-align: top !important;
    width: ${({ shrink }) => (shrink ? '200px !important' : 'initial')};
    img {
      object-fit: contain;
    }
  }
`;
