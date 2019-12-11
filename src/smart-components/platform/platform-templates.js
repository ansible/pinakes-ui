import React, { Fragment, useEffect, useReducer } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, useParams } from 'react-router-dom';
import { SearchIcon } from '@patternfly/react-icons';
import { scrollToTop } from '../../helpers/shared/helpers';
import ToolbarRenderer from '../../toolbar/toolbar-renderer';
import { defaultSettings, getCurrentPage, getNewPage } from '../../helpers/shared/pagination';
import {
  fetchPlatformItems,
  fetchSelectedPlatform
} from '../../redux/actions/platform-actions';
import PlatformItem from '../../presentational-components/platform/platform-item';
import {
  createPlatformsFilterToolbarSchema,
  createPlatformsTopToolbarSchema
} from '../../toolbar/schemas/platforms-toolbar.schema';
import ContentGalleryEmptyState from '../../presentational-components/shared/content-gallery-empty-state';
import asyncFormValidator from '../../utilities/async-form-validator';
import debouncePromise from 'awesome-debounce-promise/dist/index';
import ContentGallery from '../content-gallery/content-gallery';

const initialState = {
  filterValue: '',
  isOpen: false,
  isFetching: true,
  isFiltering: false
};

const platformItemsState = (state, action) => {
  switch (action.type) {
    case 'setFetching':
      return { ...state, isFetching: action.payload };
    case 'setFilterValue':
      return { ...state, filterValue: action.payload };
    case 'setFilteringFlag':
      return { ...state, isFiltering: action.payload };
    default:
      return state;
  }
};

const PlatformTemplates = () => {
  const { id } = useParams();
  const [{ filterValue, isFetching, isFiltering }, stateDispatch ] = useReducer(platformItemsState, initialState);
  const { data, meta } = useSelector(({ platformReducer: { platformItems }}) => platformItems[id] ? platformItems[id]
    : { data: [], meta: defaultSettings });
  const platform = useSelector(({ platformReducer: { selectedPlatform }}) => selectedPlatform);
  const dispatch = useDispatch();
  const debouncedFilter = asyncFormValidator((value, dispatch, filteringCallback, meta = defaultSettings) => {
    filteringCallback(true);
    dispatch(fetchPlatformItems(id, value, meta)).then(() => filteringCallback(false));
  }, 1000);

  const tabItems = [
    { eventKey: 0, title: 'Templates', name: `/platforms/detail/${id}/platform-templates` },
    { eventKey: 1, title: 'Inventories', name: `/platforms/detail/${id}/platform-inventories` }
  ];

  useEffect(() => {
    dispatch(fetchSelectedPlatform(id));
    dispatch(fetchPlatformItems(id, filterValue, defaultSettings))
    .then(() => stateDispatch({ type: 'setFetching', payload: false }));
    scrollToTop();
  }, [ id ]);

  const handleFilterChange = value => {
    stateDispatch({ type: 'setFilterValue', payload: value });
    debouncedFilter(value, dispatch, isFiltering => stateDispatch({ type: 'setFilteringFlag', payload: isFiltering }), {
      ...meta,
      offset: 0
    });
  };

  const handleOnPerPageSelect = (limit, debounce) => {
    const options = {
      offset: meta.offset,
      limit
    };
    const request = () => dispatch(fetchPlatformItems(id, filterValue, options));
    if (debounce) {
      return debouncePromise(request, 250)();
    }

    return request();
  };

  const handleSetPage = (number, debounce) => {
    const options = {
      offset: getNewPage(number, meta.limit),
      limit: meta.limit
    };
    const request = () => dispatch(fetchPlatformItems(id, filterValue, options));
    if (debounce) {
      return debouncePromise(request, 250)();
    }

    return request();
  };

  const renderItems = () => {
    const paginationCurrent = meta || defaultSettings;
    const filteredItems = {
      items: data ? data.map(item => <PlatformItem key={ item.id } { ...item } />) : []};

    const title = platform ? platform.name : '';
    return (
      <Fragment>
        <ToolbarRenderer schema={ createPlatformsTopToolbarSchema({
          title,
          paddingBottom: false,
          tabItems
        }) }/>
        <ToolbarRenderer schema={ createPlatformsFilterToolbarSchema({
          onFilterChange: handleFilterChange,
          searchValue: filterValue,
          pagination: {
            itemsPerPage: paginationCurrent.limit,
            numberOfItems: paginationCurrent.count,
            onPerPageSelect: handleOnPerPageSelect,
            page: getCurrentPage(paginationCurrent.limit, paginationCurrent.offset),
            onSetPage: handleSetPage,
            direction: 'down'
          }
        }) }/>
        <ContentGallery title={ title }
          isLoading={ isFetching || isFiltering }
          renderEmptyState={ () => (
            <ContentGalleryEmptyState
              title="No items"
              Icon={ SearchIcon }
              description={ filterValue === '' ? 'No items found.' : 'No items match your filter criteria.' }
            />) }
          { ...filteredItems }/>
      </Fragment>
    );};

  return (
    <Route path={ '/platforms/detail/:id/platform-templates' }
      render={ renderItems } />);
};

export default PlatformTemplates;
