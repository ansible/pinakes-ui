import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import { Section } from '@redhat-cloud-services/frontend-components';

import AddProductsGallery from './add-products-gallery';
import ToolbarRenderer from '../../../toolbar/toolbar-renderer';
import { defaultSettings } from '../../../helpers/shared/pagination';
import { filterServiceOffering } from '../../../helpers/shared/helpers';
import PlatformItem from '../../../presentational-components/platform/platform-item';
import createAddProductsSchema from '../../../toolbar/schemas/add-products-toolbar.schema';
import { fetchPlatformItems, fetchPlatforms } from '../../../redux/actions/platform-actions';
import { addToPortfolio, fetchPortfolioItemsWithPortfolio } from '../../../redux/actions/portfolio-actions';

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
  const [ isFetching, setFetching ] = useState(false);

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

  const handleAddToPortfolio = () => {
    setFetching(true);
    return addToPortfolio(portfolio.id, checkedItems)
    .then(() => setFetching(false))
    .then(() => push(portfolioRoute))
    .then(() => fetchPortfolioItemsWithPortfolio(portfolio.id))
    .catch(() => setFetching(false));
  };

  const onPlatformSelect = platform => {
    setSelectedPlatform(platform);
    fetchPlatformItems(platform.id, null, defaultSettings);
  };

  return (
    <Section>
      <ToolbarRenderer schema={ createAddProductsSchema({
        options: platforms.map(platform => ({ value: platform.id, label: platform.name, id: platform.id })),
        isFetching,
        portfolioName: portfolio && portfolio.name || '',
        itemsSelected: checkedItems.length > 0,
        onOptionSelect: onPlatformSelect,
        onFilterChange: value => handleFilterChange(value),
        portfolioRoute,
        onClickAddToPortfolio: handleAddToPortfolio,
        meta,
        platformId: selectedPlatform && selectedPlatform.id,
        searchValue,
        fetchPlatformItems
      }) } />
      <AddProductsGallery
        platform={ !!selectedPlatform }
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

