import React from 'react';

const propLine = (prop, value) => {
    return (<div className = "card_element"> { value } </div>);
};

const hasOwnValidDisplayProperty = (item, property, toDisplay) => {
    return item.hasOwnProperty(property) && toDisplay.includes(property) && item[property] && item[property] !== undefined;
};

const propertyDetails = (item, toDisplay) => {
    let details = [];

    for (let property in item) {
        if (hasOwnValidDisplayProperty(item, property, toDisplay)) {
            details.push(propLine(property, item[property].toString()));
        }
    }
    return details;
};

const itemDetails = (props, toDisplay) => {
    let details = propertyDetails(props, toDisplay);
    return (
        <React.Fragment>
            <div>{ details }</div>
        </React.Fragment>
    );
};

export default itemDetails;
