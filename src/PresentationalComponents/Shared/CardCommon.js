import React from 'react';

const propLine = value => <div className = "card_element">{ value }</div>;

const hasOwnValidDisplayProperty = (item, property, toDisplay) =>
  (item.hasOwnProperty(property) && toDisplay.includes(property) && item[property] && item[property] !== undefined);

const propertyDetails = (item, toDisplay) => {
  let details = [];
  // MAP not for in
  for (let property in item) {
    if (hasOwnValidDisplayProperty(item, property, toDisplay)) {
      details.push(propLine(property, item[property].toString()));
    }
  }

  return details;
};

// Should be component not function
const itemDetails = (props, toDisplay) => <div>{ propertyDetails(props, toDisplay) }</div>;

export default itemDetails;
