import React, { Fragment, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { SearchIcon } from '@patternfly/react-icons';
import { PlatformInventoryRow } from './platform-inventory';
import { scrollToTop } from '../../helpers/shared/helpers';
import ToolbarRenderer from '../../toolbar/toolbar-renderer';
import { defaultSettings, getCurrentPage, getNewPage } from '../../helpers/shared/pagination';
import {
  fetchPlatformInventories,
  fetchSelectedPlatform
} from '../../redux/actions/platform-actions';
import {
  createPlatformsFilterToolbarSchema,
  createPlatformsTopToolbarSchema
} from '../../toolbar/schemas/platforms-toolbar.schema';

import ContentListEmptyState from '../../presentational-components/shared/content-list-empty-state';
import asyncFormValidator from '../../utilities/async-form-validator';
import debouncePromise from 'awesome-debounce-promise/dist/index';
import ContentList from '../../presentational-components/shared/content-list';

const debouncedFilter = asyncFormValidator((value, dispatch, filteringCallback, meta = defaultSettings) => {
  filteringCallback(true);
  dispatch(fetchPlatformInventories(value, meta)).then(() => filteringCallback(false));
}, 1000);

const initialState = {
  filterValue: '',
  isOpen: false,
  isFetching: true,
  isFiltering: false
};

const platformInventoriesState = (state, action) => {
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

const PlatformInventories = (props) => {
  const [{ filterValue, isFetching, isFiltering }, stateDispatch ] = useReducer(platformInventoriesState, initialState);
  const { data, meta } = useSelector(({ platformReducer: { platformInventories }}) => platformInventories);
  const dispatch = useDispatch();

  const tabItems = [{ eventKey: 0, title: 'Templates', name: `/platforms/detail/${props.match.params.id}/platform-templates` },
    { eventKey: 1, title: 'Inventories', name: `/platforms/detail/${props.match.params.id}/platform-inventories` }];

  useEffect(() => {
    dispatch(fetchSelectedPlatform(props.match.params.id));
    dispatch(fetchPlatformInventories(props.match.params.id, filterValue, defaultSettings))
    .then(() => stateDispatch({ type: 'setFetching', payload: false }));
    scrollToTop();
  }, []);

  const handleFilterChange = value => {
    stateDispatch({ type: 'setFilterValue', payload: value });
    debouncedFilter(value, dispatch, isFiltering => stateDispatch({ type: 'setFilteringFlag', payload: isFiltering }), {
      ...meta,
      offset: 0
    });
  };

  const handleOnPerPageSelect = limit => fetchPlatformInventories(props.match.params.id, {
    offset: props.paginationCurrent.offset,
    limit
  });

  const handleSetPage = (number, debounce) => {
    const options = {
      offset: getNewPage(number, props.paginationCurrent.limit),
      limit: props.paginationCurrent.limit
    };

    const request = () => dispatch(fetchPlatformInventories(props.match.params.id, options));
    if (debounce) {
      return debouncePromise(request, 250)();
    }

    return request();
  };

  const renderItems = () => {
    console.log('Debug1');
    const inventoryRows = data ? data.map(item => <PlatformInventoryRow key={ item.id } { ...item } />) : [];
    console.log('Debug 2; data', data);
    return (
      <Fragment>
        <ToolbarRenderer schema={ createPlatformsTopToolbarSchema({
          title: props.title ? props.title : '',
          paddingBottom: false,
          tabItems
        }) }/>
        <ToolbarRenderer schema={ createPlatformsFilterToolbarSchema({
          onFilterChange: handleFilterChange,
          searchValue: filterValue,
          pagination: {
            itemsPerPage: props.paginationCurrent.limit,
            numberOfItems: props.paginationCurrent.count || 50,
            onPerPageSelect: handleOnPerPageSelect,
            page: getCurrentPage(props.paginationCurrent.limit, props.paginationCurrent.offset),
            onSetPage: handleSetPage,
            direction: 'down'
          }
        }) }/>
        <ContentList items={ inventoryRows } isLoading={ isFetching || isFiltering } renderEmptyState={ () => (
          <ContentListEmptyState
            title="No inventories"
            Icon={ SearchIcon }
            description={ filterValue === '' ? 'No inventories found.' : 'No inventories match your filter criteria.' }
          />
        ) } />
      </Fragment>
    );};

  return (
    <Switch>
      <Route path={ `/platforms/detail/${props.match.params.id}/platform-inventories` }
        render={ renderItems } />
    </Switch>
  );
};

const mapStateToProps = ({ platformReducer: { selectedPlatform, platformInventories, isPlatformDataLoading }}) => {
  const platformInventoriesData = selectedPlatform && platformInventories[selectedPlatform.id];
  return {
    paginationLinks: platformInventoriesData && platformInventoriesData.links,
    paginationCurrent: platformInventoriesData && platformInventoriesData.meta,
    platform: selectedPlatform,
    platformInventories: platformInventoriesData && platformInventoriesData.data,
    isPlatformDataLoading: !selectedPlatform || isPlatformDataLoading
  };
};

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchPlatformInventories,
  fetchSelectedPlatform
}, dispatch);

PlatformInventories.propTypes = {
  filteredItems: PropTypes.object,
  isPlatformDataLoading: PropTypes.bool,
  match: PropTypes.object,
  fetchPlatformInventories: PropTypes.func.isRequired,
  fetchSelectedPlatform: PropTypes.func,
  platform: PropTypes.shape({
    name: PropTypes.string
  }),
  title: PropTypes.string,
  platformInventories: PropTypes.array,
  paginationCurrent: PropTypes.shape({
    limit: PropTypes.number.isRequired,
    offset: PropTypes.number.isRequired,
    count: PropTypes.number
  })
};

PlatformInventories.defaultProps = {
  platformItems: [],
  paginationCurrent: {
    limit: 50,
    offset: 0
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(PlatformInventories);
