import React, { Fragment, useEffect, useReducer } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, useParams } from 'react-router-dom';
import { SearchIcon } from '@patternfly/react-icons';
import { scrollToTop } from '../../helpers/shared/helpers';
import ToolbarRenderer from '../../toolbar/toolbar-renderer';
import { defaultSettings } from '../../helpers/shared/pagination';
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
import ContentGallery from '../content-gallery/content-gallery';
import { Button } from '@patternfly/react-core';
import AsyncPagination from '../common/async-pagination';
import BottomPaginationContainer from '../../presentational-components/shared/bottom-pagination-container';

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
  const [{ filterValue, isFetching, isFiltering }, stateDispatch] = useReducer(
    platformItemsState,
    initialState
  );
  const { data, meta } = useSelector(({ platformReducer: { platformItems } }) =>
    platformItems[id] ? platformItems[id] : { data: [], meta: defaultSettings }
  );
  const platform = useSelector(
    ({ platformReducer: { selectedPlatform } }) => selectedPlatform
  );
  const dispatch = useDispatch();
  const debouncedFilter = asyncFormValidator(
    (value, dispatch, filteringCallback, meta = defaultSettings) => {
      filteringCallback(true);
      dispatch(fetchPlatformItems(id, value, meta)).then(() =>
        filteringCallback(false)
      );
    },
    1000
  );

  const tabItems = [
    {
      eventKey: 0,
      title: 'Templates',
      name: `/platforms/detail/${id}/platform-templates`
    },
    {
      eventKey: 1,
      title: 'Inventories',
      name: `/platforms/detail/${id}/platform-inventories`
    }
  ];

  useEffect(() => {
    dispatch(fetchSelectedPlatform(id));
    dispatch(fetchPlatformItems(id, filterValue, defaultSettings)).then(() =>
      stateDispatch({ type: 'setFetching', payload: false })
    );
    scrollToTop();
  }, [id]);

  const handleFilterChange = (value) => {
    stateDispatch({ type: 'setFilterValue', payload: value });
    debouncedFilter(
      value,
      dispatch,
      (isFiltering) =>
        stateDispatch({ type: 'setFilteringFlag', payload: isFiltering }),
      {
        ...meta,
        offset: 0
      }
    );
  };

  const renderItems = () => {
    const filteredItems = {
      items: data
        ? data.map((item) => <PlatformItem key={item.id} {...item} />)
        : []
    };

    const title = platform ? platform.name : '';
    return (
      <Fragment>
        <ToolbarRenderer
          schema={createPlatformsTopToolbarSchema({
            title,
            paddingBottom: false,
            tabItems
          })}
        />
        <ToolbarRenderer
          schema={createPlatformsFilterToolbarSchema({
            onFilterChange: handleFilterChange,
            searchValue: filterValue,
            filterPlaceholder: 'Filter by template...',
            meta,
            apiRequest: (_, options) =>
              dispatch(fetchPlatformItems(id, filterValue, options))
          })}
        />
        <ContentGallery
          title={title}
          isLoading={isFetching || isFiltering}
          renderEmptyState={() => (
            <ContentGalleryEmptyState
              title={filterValue === '' ? 'No templates' : 'No results found'}
              Icon={SearchIcon}
              PrimaryAction={() =>
                filterValue !== '' ? (
                  <Button onClick={() => handleFilterChange('')} variant="link">
                    Clear all filters
                  </Button>
                ) : null
              }
              description={
                filterValue === ''
                  ? 'This platform has no templates.'
                  : 'No results match the filter critera. Remove all filters or clear all filters to show results.'
              }
            />
          )}
          {...filteredItems}
        />
        {meta.count > 0 && (
          <BottomPaginationContainer>
            <AsyncPagination
              dropDirection="up"
              meta={meta}
              apiRequest={(_, options) =>
                dispatch(fetchPlatformItems(id, filterValue, options))
              }
            />
          </BottomPaginationContainer>
        )}
      </Fragment>
    );
  };

  return (
    <Route
      path={'/platforms/detail/:id/platform-templates'}
      render={renderItems}
    />
  );
};

export default PlatformTemplates;
