import React from 'react';
import propTypes from 'prop-types';
import { Button, Title } from '@patternfly/react-core';
import './removeportfolioitems.scss';
import { Link } from 'react-router-dom';

const RemovePortfolioItems = ({ portfolioRoute, onRemove }) => (
  <div className="remove">
    <Title size={ '2x1' }>Remove Products</Title>
    <div className="buttons_right">
      <Link to={ portfolioRoute }>
        <Button variant="link" aria-label="Cancel removing portfolio items">Cancel</Button>
      </Link>
      <Button variant="primary" aria-label="Remove selected portfolio items" onClick={ onRemove }>Remove</Button>
    </div>
  </div>
);

RemovePortfolioItems.propTypes = {
  onCancel: propTypes.func,
  onRemove: propTypes.func,
  portfolioRoute: propTypes.string
};

export default RemovePortfolioItems;
