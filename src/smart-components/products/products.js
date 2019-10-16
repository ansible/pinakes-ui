import React, { useEffect, useReducer } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SearchIcon } from '@patternfly/react-icons';

import { fetchPortfolioItems } from '../../redux/actions/portfolio-actions';
import { scrollToTop } from '../../helpers/shared/helpers';
import PortfolioItem from '../portfolio/portfolio-item';
import createProductsToolbarSchema from '../../toolbar/schemas/products-toolbar.schema';
import ToolbarRenderer from '../../toolbar/toolbar-renderer';
import { defaultSettings } from '../../helpers/shared/pagination';
import ContentGallery from '../content-gallery/content-gallery';
import { fetchPlatforms } from '../../redux/actions/platform-actions';
import asyncFormValidator from '../../utilities/async-form-validator';
import ContentGalleryEmptyState from '../../presentational-components/shared/content-gallery-empty-state';

const debouncedFilter = asyncFormValidator((value, dispatch, filteringCallback) => {
  filteringCallback(true);
  dispatch(fetchPortfolioItems(value, defaultSettings)).then(() => filteringCallback(false));
}, 1000);

const buildItemUrl = ({ portfolio_id, id }) => portfolio_id && `/portfolios/detail/${portfolio_id}/product/${id}`;

const initialState = {
  filterValue: '',
  isOpen: false,
  isFetching: true,
  isFiltering: false
};

const productsState = (state, action) => {
  switch (action.type) {
    case 'setFetching':
      return { ...state, isFetching: action.payload };
    case 'setFilterValue':
      return { ...state, filterValue: action.payload };
    case 'setFilteringFlag':
      return { ...state, isFiltering: action.payload };
  }

  return state;
};

const Products = () => {
  const [{ isFetching, filterValue, isFiltering }, stateDispatch ] = useReducer(productsState, initialState);
  const dispatch = useDispatch();
  const { data, meta } = useSelector(({ portfolioReducer: { portfolioItems }}) => portfolioItems);

  useEffect(() => {
    Promise.all([
      dispatch(fetchPortfolioItems(undefined, defaultSettings)),
      dispatch(fetchPlatforms())
    ]).then(() => stateDispatch({ type: 'setFetching', payload: false }));
    scrollToTop();
  }, []);

  const handleFilterItems = value => {
    stateDispatch({ type: 'setFilterValue', payload: value });
    debouncedFilter(value, dispatch, isFiltering => stateDispatch({ type: 'setFilteringFlag', payload: isFiltering }));
  };

  const galleryItems = data.map(item => <PortfolioItem key={ item.id } url={ buildItemUrl(item) } { ...item } />);

  return (
    <div>
      <ToolbarRenderer schema={ createProductsToolbarSchema({
        filterProps: {
          searchValue: filterValue,
          onFilterChange: handleFilterItems,
          placeholder: 'Filter by name...'
        },
        title: 'Products',
        isLoading: isFiltering || isFetching,
        meta,
        fetchProducts: (...args) => dispatch(fetchPortfolioItems(...args))
      }) } />
      <ContentGallery
        isLoading={ isFiltering || isFetching }
        items={ galleryItems }
        renderEmptyState={ () => <ContentGalleryEmptyState title="Foo" description="Bar" Icon={ SearchIcon } /> }
      />
    </div>
  );
};

export default Products;
