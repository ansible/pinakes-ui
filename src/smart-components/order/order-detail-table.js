import React from 'react';
import PropTypes from 'prop-types';
import StepLabel from './step-label';

const OrderDetailTable = ({ requests }) => (
  <table className="requests-table">
    <thead>
      <tr>
        <th>
          Steps
        </th>
        <th>
          Performed by
        </th>
        <th>
          Date &amp; time
        </th>
        <th>
          Status
        </th>
      </tr>
    </thead>
    <tbody>
      { requests.map(({ reason, requester, updated_at, state }, index) => (
        <tr key={ index } className={ state }>
          <td><StepLabel index={ index } text={ reason } /></td>
          <td>{ requester }</td>
          <td>{ new Date(updated_at).toLocaleDateString() }</td>
          <td>{ state }</td>
        </tr>
      )) }
    </tbody>
  </table>
);

OrderDetailTable.propTypes = {
  requests: PropTypes.arrayOf(PropTypes.shape({
    reason: PropTypes.string,
    requester: PropTypes.string,
    updated_at: PropTypes.string,
    state: PropTypes.string
  })).isRequired
};

export default OrderDetailTable;
