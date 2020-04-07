import React, { useState, useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';

import AddProductsGallery from './add-products-gallery';
import ToolbarRenderer from '../../../toolbar/toolbar-renderer';
import { defaultSettings } from '../../../helpers/shared/pagination';
import { filterServiceOffering } from '../../../helpers/shared/helpers';
import PlatformItem from '../../../presentational-components/platform/platform-item';
import createAddProductsSchema from '../../../toolbar/schemas/add-products-toolbar.schema';
import {
  fetchPlatformItems,
  fetchPlatforms
} from '../../../redux/actions/platform-actions';
import {
  addToPortfolio,
  fetchPortfolioItemsWithPortfolio
} from '../../../redux/actions/portfolio-actions';
import AsyncPagination from '../../common/async-pagination';
import useEnhancedHistory from '../../../utilities/use-enhanced-history';
import { useDispatch, useSelector } from 'react-redux';
import BottomPaginationContainer from '../../../presentational-components/shared/bottom-pagination-container';

const renderGalleryItems = (items = [], checkItem, checkedItems, filter) =>
  items
    .filter((item) => filterServiceOffering(item, filter))
    .map((item) => (
      <PlatformItem
        key={item.id}
        {...item}
        editMode
        onToggleItemSelect={() => checkItem(item.id)}
        checked={checkedItems.includes(item.id)}
      />
    ));

const AddProductsToPortfolio = ({ portfolioRoute }) => {
  const [searchValue, handleFilterChange] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState(undefined);
  const [checkedItems, setCheckedItems] = useState([]);
  const [isFetching, setFetching] = useState(false);
  const { push } = useEnhancedHistory();
  const dispatch = useDispatch();
  const { portfolio, platforms, platformItems, isLoading } = useSelector(
    ({
      portfolioReducer: { selectedPortfolio },
      platformReducer: { platforms, platformItems, isPlatformDataLoading }
    }) => ({
      platforms,
      platformItems,
      isLoading: isPlatformDataLoading,
      portfolio: selectedPortfolio
    })
  );

  useEffect(() => {
    dispatch(fetchPlatforms());
  }, []);

  const checkItem = (itemId) => {
    const index = checkedItems.indexOf(itemId);
    return index > -1
      ? [...checkedItems.slice(0, index), ...checkedItems.slice(index + 1)]
      : [...checkedItems, itemId];
  };

  const items =
    selectedPlatform && platformItems[selectedPlatform.id]
      ? platformItems[selectedPlatform.id].data
      : [];
  const meta =
    selectedPlatform &&
    platformItems[selectedPlatform.id] &&
    platformItems[selectedPlatform.id].meta;

  const handleAddToPortfolio = () => {
    setFetching(true);
    return dispatch(addToPortfolio(portfolio.id, checkedItems))
      .then(() => setFetching(false))
      .then(() =>
        push({ pathname: portfolioRoute, search: `?portfolio=${portfolio.id}` })
      )
      .then(() => dispatch(fetchPortfolioItemsWithPortfolio(portfolio.id)))
      .catch(() => setFetching(false));
  };

  const onPlatformSelect = (platform) => {
    setSelectedPlatform(platform);
    dispatch(fetchPlatformItems(platform.id, null, defaultSettings));
  };

  return (
    <Fragment>
      <ToolbarRenderer
        schema={createAddProductsSchema({
          options: platforms.map((platform) => ({
            value: platform.id,
            label: platform.name,
            id: platform.id
          })),
          isFetching,
          portfolioName: (portfolio && portfolio.name) || '',
          itemsSelected: checkedItems.length > 0,
          onOptionSelect: onPlatformSelect,
          onFilterChange: (value) => handleFilterChange(value),
          portfolioRoute,
          onClickAddToPortfolio: handleAddToPortfolio,
          meta,
          platformId: selectedPlatform && selectedPlatform.id,
          searchValue,
          fetchPlatformItems: (id, options) =>
            fetchPlatformItems(id, searchValue, options)
        })}
      />
      <AddProductsGallery
        platform={!!selectedPlatform}
        checkedItems={checkedItems}
        isLoading={isLoading}
        items={renderGalleryItems(
          items,
          (itemId) => setCheckedItems(checkItem(itemId)),
          checkedItems,
          searchValue
        )}
      />
      {meta && meta.count > 0 && (
        <BottomPaginationContainer>
          <AsyncPagination
            meta={meta}
            apiProps={selectedPlatform && selectedPlatform.id}
            apiRequest={(id, options) =>
              fetchPlatformItems(id, searchValue, options)
            }
            dropDirection="up"
          />
        </BottomPaginationContainer>
      )}
    </Fragment>
  );
};

AddProductsToPortfolio.propTypes = {
  portfolioRoute: PropTypes.string.isRequired
};

export default AddProductsToPortfolio;
