import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const ConditionalLink = ({ children, to, ...props }) => to ? (
  <Link to={ to } { ...props }>
    { children }
  </Link>
) : children;

ConditionalLink.propTypes = {
  to: PropTypes.oneOfType([ PropTypes.string, PropTypes.object ]),
  children: PropTypes.oneOfType([ PropTypes.node, PropTypes.arrayOf(PropTypes.node) ]).isRequired
};

export default ConditionalLink;
