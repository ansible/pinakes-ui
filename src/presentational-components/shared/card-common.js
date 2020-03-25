import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const CardPropText = styled.div`
  overflow: hidden;
`;

const ItemDetails = ({ toDisplay = [], ...item }) =>
  toDisplay.map((prop) => (
    <CardPropText key={`card-prop-${prop}`}>{item[prop]}</CardPropText>
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
