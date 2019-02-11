import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import { Link } from 'react-router-dom';
import { Level, LevelItem, TextContent, Text, TextVariants, Button } from '@patternfly/react-core';
import TopToolbar from '../Shared/top-toolbar';
import OrderToolbarItem from '../Shared/OrderToolbarItem';
import FilterToolbarItem from '../Shared/FilterToolbarItem';
import '../../SmartComponents/Portfolio/portfolio.scss';
import '../Shared/toolbarschema.scss';

const PortfolioOrderToolbar = ({
  portfolioName,
  portfolioRoute,
  onClickAddToPortfolio,
  itemsSelected,
  onOptionSelect,
  options,
  onFilterChange,
  searchValue
}) => (
  <TopToolbar>
    <Level>
      <LevelItem>
        <TextContent>
          <Text component={ TextVariants.h2 }>Add products: { portfolioName }</Text>
        </TextContent>
      </LevelItem>
      <LevelItem>
        <OrderToolbarItem/>
      </LevelItem>
    </Level>
    <Level  className="pf-u-mt-lg">
      <LevelItem className="pf-u-display-flex pf-u-flex-direction-row">
        <div className="pf-u-mr-md">
          <FilterToolbarItem onFilterChange={ onFilterChange } searchValue={ searchValue } placeholder="Filter products"/>
        </div>
        <Select
          styles={ { container: base => ({ ...base, minWidth: 260 }) } }
          isMulti={ true }
          placeholder={ 'Filter by Platform' }
          options={ options }
          onChange={ onOptionSelect }
          closeMenuOnSelect={ false }
        />
      </LevelItem>
      <LevelItem>
        <Link to={ portfolioRoute }>
          <Button variant="link" aria-label="Cancel Add products to Portfolio">
            Cancel
          </Button>
        </Link>
        <Button key="addproducts"
          variant="primary"
          aria-label="Add products to Portfolio"
          type="button" onClick={ onClickAddToPortfolio }
          isDisabled={ !itemsSelected }>
          Add
        </Button>
      </LevelItem>
    </Level>
  </TopToolbar>
);

PortfolioOrderToolbar.propTypes = {
  portfolioName: PropTypes.string.isRequired,
  portfolioRoute: PropTypes.string.isRequired,
  onClickAddToPortfolio: PropTypes.func.isRequired,
  itemsSelected: PropTypes.bool,
  onOptionSelect: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]).isRequired
  })).isRequired,
  onFilterChange: PropTypes.func.isRequired,
  searchValue: PropTypes.string
};

export default PortfolioOrderToolbar;

