import React from 'react';
import PropTypes from 'prop-types';

const ViewProvider = (props) => {
    return (
        <h1>Rule {props.match.params.id}</h1>
    );
};

ViewProvider.displayName = 'view-provider';

ViewProvider.propTypes = {
    match: PropTypes.object
};

export default ViewProvider;
