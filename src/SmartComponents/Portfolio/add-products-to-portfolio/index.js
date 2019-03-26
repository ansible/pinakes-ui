import React, { useState, useEffect } from 'react';
import { pipe } from 'rxjs';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import { Section } from '@red-hat-insights/insights-frontend-components';

import AddProductsGallery from './add-products-gallery';
import AddProductsPagination from './add-products-pagination';
import { defaultSettings } from '../../../helpers/shared/pagination';
import { filterServiceOffering } from '../../../helpers/shared/helpers';
import { fetchPlatformItems, fetchPlatforms } from '../../../redux/Actions/PlatformActions';
import PlatformItem from '../../../presentational-components/platform/platform-item';
import PortfolioOrderToolbar from '../../../presentational-components/portfolio/portfolio-order-toolbar';
import { addToPortfolio, fetchPortfolioItemsWithPortfolio } from '../../../redux/Actions/PortfolioActions';

const renderGalleryItems = (items = [], checkItem, checkedItems, filter) => items.filter(item => filterServiceOffering(item, filter))
.map(item => (
  <PlatformItem
    key={ item.id }
    { ...item }
    editMode
    onToggleItemSelect={ () => checkItem(item.id) }
    checked={ checkedItems.includes(item.id) }
  />
));

const AddProductsToPortfolio = ({
  portfolio,
  portfolioRoute,
  platforms,
  isLoading,
  platformItems,
  fetchPlatformItems,
  addToPortfolio,
  fetchPlatforms,
  fetchPortfolioItemsWithPortfolio,
  history: { push }
}) => {
  const [ searchValue, handleFilterChange ] = useState('');
  const [ selectedPlatform, setSelectedPlatform ] = useState(undefined);
  const [ checkedItems, setCheckedItems ] = useState([]);

  useEffect(() => { fetchPlatforms(); }, []);

  const checkItem = itemId => {
    const index = checkedItems.indexOf(itemId);
    return index > -1 ? [
      ...checkedItems.slice(0, index),
      ...checkedItems.slice(index + 1)
    ] : [ ...checkedItems, itemId ];
  };

  const items = selectedPlatform && platformItems[selectedPlatform.id] ? platformItems[selectedPlatform.id].data : [];
  const meta = selectedPlatform && platformItems[selectedPlatform.id] && platformItems[selectedPlatform.id].meta;

  const handleAddToPortfolio = () => addToPortfolio(portfolio.id, checkedItems)
  .then(() => push(portfolioRoute))
  .then(() => fetchPortfolioItemsWithPortfolio(portfolio.id));

  const onPlatformSelect = platform => pipe(
    setSelectedPlatform(platform),
    fetchPlatformItems(platform.id, defaultSettings)
  );

  return (
    <Section>
      <PortfolioOrderToolbar
        portfolioName={ `${portfolio && portfolio.name || ''} new One` }
        onClickAddToPortfolio={ handleAddToPortfolio }
        itemsSelected={ checkedItems.length > 0 }
        portfolioRoute={ portfolioRoute }
        searchValue={ searchValue }
        onFilterChange={ value => handleFilterChange(value) }
        onOptionSelect={ onPlatformSelect }
        options={ platforms.map(platform => ({ value: platform.id, label: platform.name, id: platform.id })) }
      >
        { meta && <AddProductsPagination meta={ meta } platformId={ selectedPlatform.id } /> }
      </PortfolioOrderToolbar>
      <AddProductsGallery
        checkedItems={ checkedItems }
        isLoading={ isLoading }
        items={ renderGalleryItems(items, itemId => setCheckedItems(checkItem(itemId)), checkedItems, searchValue) }
      />
    </Section>
  );
};

AddProductsToPortfolio.propTypes = {
  portfolio: PropTypes.shape({
    name: PropTypes.string.isRequired
  }),
  portfolioRoute: PropTypes.string.isRequired,
  platforms: PropTypes.arrayOf(
    PropTypes.shape({ id: PropTypes.string.isRequired, name: PropTypes.string.isRequired })
  ).isRequired,
  isLoading: PropTypes.bool,
  platformItems: PropTypes.object.isRequired,
  fetchPlatformItems: PropTypes.func.isRequired,
  addToPortfolio: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  fetchPortfolioItemsWithPortfolio: PropTypes.func.isRequired,
  fetchPlatforms: PropTypes.func.isRequired
};

const mapStateToProps = ({ platformReducer: { platforms, platformItems, isPlatformDataLoading }}) => ({
  platforms,
  isLoading: isPlatformDataLoading,
  platformItems
});

const mapDispatchToProps = dispatch => bindActionCreators({
  addToPortfolio,
  fetchPlatforms,
  fetchPlatformItems,
  fetchPortfolioItemsWithPortfolio
}, dispatch);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AddProductsToPortfolio));

