import React from 'react';
import PropTypes from 'prop-types';
import './top-toolbar.scss';

const TopToolbar = ({ children, paddingBottom }) => (
  <div className={ `pf-u-pt-xl pf-u-pr-xl pf-u-pl-xl ${paddingBottom ? 'pf-u-pb-xl' : ''} top-toolbar` }>
    { children }
  </div>
);

TopToolbar.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired,
  paddingBottom: PropTypes.bool
};

TopToolbar.defaultProps = {
  paddingBottom: true
};

export default TopToolbar;
