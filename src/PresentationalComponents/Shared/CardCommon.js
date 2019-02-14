import React from 'react';
import PropTypes from 'prop-types';

const PropLine = ({ value }) => <div>{ value }</div>;

PropLine.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.arrayOf(PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ]))
  ]).isRequired
};

const ItemDetails = ({ toDisplay = [], ...item }) => (
  <div className="line-clamp">
    { toDisplay.map(prop => <PropLine key={ `card-prop-${prop}` } value={ item[prop] } />) }
  </div>
);

ItemDetails.propTypes = {
  toDisplay: PropTypes.arrayOf(PropTypes.string)
};

ItemDetails.defaultProps = {
  toDisplay: []
};

export default ItemDetails;
