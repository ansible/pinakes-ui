import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Button, TextContent, Text, TextVariants, Level, LevelItem  } from '@patternfly/react-core';
import TopToolbar from '../../PresentationalComponents/Shared/top-toolbar';
import OrderToolbarItem from '../../PresentationalComponents/Shared/OrderToolbarItem';
import FilterToolbarItem from '../../PresentationalComponents/Shared/FilterToolbarItem';
import './removeportfolioitems.scss';

const RemovePortfolioItems = ({ portfolioRoute, onRemove, portfolioName, filterValue, onFilterChange, disableButton }) => (
  <TopToolbar>
    <Level>
      <LevelItem>
        <TextContent>
          <Text component={ TextVariants.h2 }>Remove products: { portfolioName }</Text>
        </TextContent>
      </LevelItem>
      <LevelItem>
        <OrderToolbarItem />
      </LevelItem>
    </Level>
    <Level className="pf-u-mt-lg">
      <LevelItem>
        <FilterToolbarItem placeholder="Find a product" searchValue={ filterValue } onFilterChange={ onFilterChange } />
      </LevelItem>
      <LevelItem>
        <Link to={ portfolioRoute }>
          <Button variant="link" aria-label="Cancel removing portfolio items">Cancel</Button>
        </Link>
        <Button isDisabled={ disableButton } variant="danger" aria-label="Remove selected portfolio items" onClick={ onRemove }>Remove</Button>
      </LevelItem>
    </Level>
  </TopToolbar>
);

RemovePortfolioItems.propTypes = {
  onCancel: PropTypes.func,
  onRemove: PropTypes.func,
  portfolioRoute: PropTypes.string,
  portfolioName: PropTypes.string,
  filterValue: PropTypes.string.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  disableButton: PropTypes.bool
};

RemovePortfolioItems.defaultProps = {
  disableButton: false
};

export default RemovePortfolioItems;
