import React from 'react';
import PropTypes from 'prop-types';
import Dotdotdot from 'react-dotdotdot';

const PropLine = ({ value }) => <div>{ value }</div>;

PropLine.propTypes = {
  value: PropTypes.any.isRequired
};

const ItemDetails = ({ toDisplay = [], ...item }) => (
  <Dotdotdot clamp={ 6 }>
    { toDisplay.map(prop => <PropLine key={ `card-prop-${prop}` } value={ item[prop] } />) }
  </Dotdotdot>
);

ItemDetails.propTypes = {
  toDisplay: PropTypes.arrayOf(PropTypes.oneOfType([ PropTypes.string, PropTypes.node, PropTypes.arrayOf(PropTypes.node) ]))
};

ItemDetails.defaultProps = {
  toDisplay: []
};

export default ItemDetails;
