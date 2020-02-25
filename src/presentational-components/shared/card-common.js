import React from 'react';
import PropTypes from 'prop-types';

const ItemDetails = ({ toDisplay = [], ...item }) =>
  toDisplay.map((prop) => (
    <div className="card-prop-text" key={`card-prop-${prop}`}>
      {item[prop]}
    </div>
  ));

ItemDetails.propTypes = {
  toDisplay: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.node,
      PropTypes.arrayOf(PropTypes.node)
    ])
  )
};

ItemDetails.defaultProps = {
  toDisplay: []
};

export default ItemDetails;
