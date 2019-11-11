import React, { useEffect, Fragment, useReducer } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Switch, useParams } from 'react-router-dom';
import { Section } from '@redhat-cloud-services/frontend-components';
import debouncePromise from 'awesome-debounce-promise';
import ToolbarRenderer from '../../toolbar/toolbar-renderer';
import ContentGallery from '../content-gallery/content-gallery';
import { scrollToTop } from '../../helpers/shared/helpers';
import PlatformItem from '../../presentational-components/platform/platform-item';
import { createPlatformsTopToolbarSchema, createPlatformsFilterToolbarSchema } from '../../toolbar/schemas/platforms-toolbar.schema';
import { defaultSettings, getCurrentPage, getNewPage } from '../../helpers/shared/pagination';
import ContentGaleryEmptyState from '../../presentational-components/shared/content-gallery-empty-state';
import {
  fetchSelectedPlatform,
  fetchPlatformItems
} from '../../redux/actions/platform-actions';
import asyncFormValidator from '../../utilities/async-form-validator';
import { SearchIcon } from '@patternfly/react-icons/dist/js/index';

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

const PlatformTemplates = (props) => {
  const [{ filterValue, isFetching, isFiltering }, stateDispatch ] = useReducer(platformItemsState, initialState);
  const { platformItems, meta } = useSelector(({ platformReducer: { platformItems }}) => platformItems);
  const platform = useSelector(({ platformReducer: { selectedPlatform }}) => selectedPlatform);
  const dispatch = useDispatch();
  const { id } = useParams();
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

  const handleOnPerPageSelect = limit => fetchPlatformItems(id, {
    offset: meta.offset,
    limit
  });

  const handleSetPage = (number, debounce) => {
    const options = {
      offset: getNewPage(number, meta.limit),
      limit: props.paginationCurrent.limit
    };

    const request = () => dispatch(fetchPlatformItems(id, filterValue, options));
    if (debounce) {
      return debouncePromise(request, 250)();
    }

    return request();
  };

  const renderItems = () => {
    const paginationCurrent = meta || defaultSettings;
    let filteredItems = {
      items: platformItems ? platformItems.map(data => <PlatformItem key={ data.id } { ...data } />) : [],
      isLoading: isFetching || isFiltering
    };

    let title = platform ? platform.name : '';
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
            numberOfItems: paginationCurrent.count || 50,
            onPerPageSelect: handleOnPerPageSelect,
            page: getCurrentPage(paginationCurrent.limit, paginationCurrent.offset),
            onSetPage: handleSetPage,
            direction: 'down'
          }
        }) }/>
        <Section type="content">
          <ContentGallery
            isLoading={ isFetching || isFiltering }
            renderEmptyState={ () => (
              <ContentGaleryEmptyState
                title="No platform templates"
                Icon={ SearchIcon }
                description={ filterValue === '' ? 'No templates found.' : 'No templates match your filter criteria.' }
              />) }
            { ...filteredItems }/>
        </Section>
      </Fragment>
    );
  };

  return (
    <Switch>
      <Route path={ '/platforms/detail/:id/platform-templates' }
        render={ renderItems } />
    </Switch>
  );
};

PlatformTemplates.propTypes = {
  filteredItems: PropTypes.object,
  isPlatformDataLoading: PropTypes.bool,
  match: PropTypes.object,
  platform: PropTypes.shape({
    name: PropTypes.string
  }),
  platformItems: PropTypes.array,
  paginationCurrent: PropTypes.shape({
    limit: PropTypes.number.isRequired,
    offset: PropTypes.number.isRequired,
    count: PropTypes.number.isRequired
  })
};

PlatformTemplates.defaultProps = {
  platformItems: [],
  paginationCurrent: {
    limit: 50
  }
};

export default PlatformTemplates;
