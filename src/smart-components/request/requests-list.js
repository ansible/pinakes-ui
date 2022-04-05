
import React, { Fragment, useEffect, useReducer, useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { Button } from '@patternfly/react-core';
import { sortable, wrappable, cellWidth, breakWord } from '@patternfly/react-table';
import { useIntl } from 'react-intl';
import { CubesIcon, SearchIcon } from '@patternfly/react-icons';
import isEmpty from 'lodash/isEmpty';

import { fetchRequests,
  sortRequests,
  setFilterValueRequests,
  clearFilterValueRequests,
  resetRequestList } from '../../redux/actions/request-actions';
import { createRows } from './request-table-helpers';
import { fetchRequests as fetchRequestsS } from '../../redux/actions/request-actions-s';

import { TableToolbarView } from '../../presentational-components/shared/table-toolbar-view';
import { APPROVAL_APPROVER_PERSONA, isStandalone, useIsApprovalAdmin, useIsApprovalApprover } from '../../helpers/shared/helpers';
import { TopToolbar, TopToolbarTitle } from '../../presentational-components/shared/top-toolbar';
import { AppTabs } from '../../smart-components/app-tabs/app-tabs';
import asyncDebounce from '../../utilities/async-debounce';
import TableEmptyState from '../../presentational-components/shared/table-empty-state';
import UserContext from '../../user-context';
import { prepareChips } from './chips-helpers';
import routes from '../../constants/routes';
import tableToolbarMessages from '../../messages/table-toolbar.messages';
import requestsMessages from '../../messages/requests.messages';
import commonMessages from '../../messages/common.message';
import { Route } from 'react-router-dom';
import routesLinks from '../../constants/routes';
import ActionModal from './action-modal';
import { defaultSettings } from '../../helpers/shared/pagination';

const columns = (intl) => [{
  title: intl.formatMessage(requestsMessages.requestsIdColumn),
  transforms: [ sortable, cellWidth(10) ]
},
{ title: intl.formatMessage(tableToolbarMessages.name), transforms: [ sortable, wrappable, cellWidth(25) ], cellTransforms: [ breakWord ]},
{ title: intl.formatMessage(requestsMessages.requesterColumn), transforms: [ sortable, wrappable, cellWidth(25) ]},
{ title: intl.formatMessage(requestsMessages.updatedColumn), transforms: [ cellWidth(15) ]},
{ title: intl.formatMessage(requestsMessages.statusColumn), transforms: [ sortable, cellWidth(25) ]}
];

const fetchRequestsData = (persona, pagination) => isStandalone() ? fetchRequestsS (persona, pagination) : fetchRequests(persona, pagination);
const debouncedFilter = asyncDebounce(
  (dispatch, filteringCallback, persona, updateFilter) => {
    filteringCallback(true);
    updateFilter && updateFilter();
    return dispatch(fetchRequestsData(persona)).then(() =>
      filteringCallback(false)
    );
  },
  1000
);

const initialState = (nameValue = '', requesterValue = '') => ({
  nameValue,
  requesterValue,
  isOpen: false,
  isFetching: true,
  isFiltering: false,
  rows: []
});

const requestsListState = (state, action) => {
  switch (action.type) {
    case 'setFetching':
      return { ...state, isFetching: action.payload };
    case 'setNameValue':
      return { ...state, nameValue: action.payload };
    case 'setRequesterValue':
      return { ...state, requesterValue: action.payload };
    case 'clearFilters':
      return { ...state, requesterValue: '', nameValue: '', isFetching: true };
    case 'setFilteringFlag':
      return { ...state, isFiltering: action.payload };
    case 'setRows':
      return { ...state, rows: action.payload };
    default:
      return state;
  }
};

const RequestsList = ({ persona, indexpath, actionResolver }) => {
  const [ limit, setLimit ] = useState(defaultSettings.limit);
  const [ offset, setOffset ] = useState(1);
  const { requests: { data, meta, count }, sortBy, filterValue } = useSelector(
    ({ requestReducer: { requests, sortBy, filterValue }}) => ({ requests, sortBy, filterValue }),
    shallowEqual
  );
  const metaInfo = meta || { count, limit, offset };
  const [{ nameValue, isFetching, isFiltering, requesterValue, rows }, stateDispatch ] = useReducer(
    requestsListState,
    initialState(filterValue.name, filterValue.requester)
  );

  const { userRoles: userRoles } = useContext(UserContext);

  const dispatch = useDispatch();
  const intl = useIntl();
  const isApprovalAdmin = useIsApprovalAdmin(userRoles);
  const isApprovalApprover = useIsApprovalApprover(userRoles);
  const noRequestsMessage = () => (indexpath === routesLinks.allrequest) ?
    intl.formatMessage(requestsMessages.emptyAllRequestsDescription) : intl.formatMessage(requestsMessages.emptyRequestsDescription);

  const updateRequests = (pagination) => {
    if (!isApprovalApprover && persona === APPROVAL_APPROVER_PERSONA) {
      stateDispatch({ type: 'setFetching', payload: false });
      return;
    }

    stateDispatch({ type: 'setFetching', payload: true });
    return dispatch(fetchRequestsData(persona, pagination))
    .then(() => stateDispatch({ type: 'setFetching', payload: false }))
    .catch(() => stateDispatch({ type: 'setFetching', payload: false }));
  };

  const routes = () => <Fragment>
    <Route exact path={ routesLinks.requests.comment } render={ props => <ActionModal { ...props }
      actionType={ 'Comment' }
      postMethod={ () => updateRequests(metaInfo) }
    /> }/>
    <Route exact path={ routesLinks.requests.approve } render={ props => <ActionModal { ...props } actionType={ 'Approve' }
      postMethod={ () => updateRequests(metaInfo) }
    /> } />
    <Route exact path={ routesLinks.requests.deny } render={ props => <ActionModal { ...props } actionType={ 'Deny' }
      postMethod={ () => updateRequests(metaInfo) }
    /> } />
  </Fragment>;

  const resetList = () => {
    stateDispatch({ type: 'clearFilters' });
    dispatch(clearFilterValueRequests());
    dispatch(resetRequestList());
  };

  useEffect(() => {
    resetList();
    updateRequests();
  }, [ persona ]);

  useEffect(() => {
    stateDispatch({ type: 'setRows', payload: createRows(actionResolver, data, indexpath, intl) });
  }, [ data ]);

  const handleFilterChange = (value, type) => {
    const updateFilter = () => dispatch(setFilterValueRequests(value, type));

    let debouncedValue = false;

    if (type === 'name') {
      stateDispatch({ type: 'setNameValue', payload: value });
      debouncedValue = true;
    } else if (type === 'requester') {
      stateDispatch({ type: 'setRequesterValue', payload: value });
      debouncedValue = true;
    }

    if (!debouncedValue) {
      dispatch(setFilterValueRequests(value, type));
    }

    return debouncedFilter(
      dispatch,
      (isFiltering) =>
        stateDispatch({ type: 'setFilteringFlag', payload: isFiltering }),
      persona,
      debouncedValue && updateFilter
    );
  };

  const onSort = (_e, index, direction, { property }) => {
    stateDispatch({ type: 'setFetching', payload: true });
    dispatch(sortRequests({ index, direction, property }));
    return updateRequests();
  };

  const clearFilters = () => {
    stateDispatch({ type: 'clearFilters' });
    dispatch(clearFilterValueRequests());
    return updateRequests();
  };

  const onDeleteChip = ([{ key, chips: [{ value }] }]) => {
    const newValue = [ 'name', 'requester' ].includes(key) ? '' : filterValue[key].filter(val => value !== val);
    handleFilterChange(newValue, key);
  };

  return (
    <Fragment>
      <TopToolbar className="top-toolbar">
        <TopToolbarTitle title={ intl.formatMessage(commonMessages.approvalTitle) }/>
        { isApprovalAdmin && <AppTabs/> }
      </TopToolbar>
      <TableToolbarView
        ouiaId={ 'requests-table' }
        sortBy={ sortBy }
        onSort={ onSort }
        rows={ rows }
        columns={ columns(intl) }
        fetchData={ updateRequests }
        routes={ routes }
        titlePlural={ intl.formatMessage(requestsMessages.requests) }
        titleSingular={ intl.formatMessage(requestsMessages.request) }
        pagination={ metaInfo }
        setLimit={ setLimit }
        setOffset={ setOffset }
        handlePagination={ updateRequests }
        filterValue={ nameValue }
        onFilterChange={ (value) => handleFilterChange(value, 'name') }
        isLoading={ isFetching || isFiltering }
        renderEmptyState={ () => (
          <TableEmptyState
            title={ isEmpty(filterValue)
              ? intl.formatMessage(requestsMessages.emptyRequestsTitle)
              : intl.formatMessage(tableToolbarMessages.noResultsFound)
            }
            icon={ isEmpty(filterValue) ? CubesIcon : SearchIcon }
            PrimaryAction={ () =>
              isEmpty(filterValue) ? noRequestsMessage() : (
                <Button onClick={ clearFilters } variant="link" ouiaId={ `clear-filter-requests` }>
                  { intl.formatMessage(tableToolbarMessages.clearAllFilters) }
                </Button>
              )
            }
            description={
              isEmpty(filterValue)
                ? ''
                : intl.formatMessage(tableToolbarMessages.clearAllFiltersDescription)
            }
            isSearch={ !isEmpty(filterValue) }
          />
        ) }
        activeFiltersConfig={ {
          filters: prepareChips({ name: nameValue, requester: requesterValue, decision: filterValue.decision }, intl),
          onDelete: (_e, chip, deleteAll) => deleteAll ? clearFilters() : onDeleteChip(chip)
        } }
        filterConfig={ [
          {
            label: intl.formatMessage(requestsMessages.requesterColumn),
            filterValues: {
              placeholder: intl.formatMessage(
                tableToolbarMessages.filterByTitle,
                { title: intl.formatMessage(requestsMessages.requesterColumn).toLowerCase() }
              ),
              'aria-label': intl.formatMessage(
                tableToolbarMessages.filterByTitle,
                { title: intl.formatMessage(requestsMessages.requesterColumn).toLowerCase() }
              ),
              onChange: (_event, value) => handleFilterChange(value, 'requester'),
              value: requesterValue
            }
          }, {
            label: intl.formatMessage(requestsMessages.statusColumn),
            type: 'checkbox',
            filterValues: {
              placeholder: intl.formatMessage(
                tableToolbarMessages.filterByTitle,
                { title: intl.formatMessage(requestsMessages.statusColumn).toLowerCase() }
              ),
              'aria-label': intl.formatMessage(
                tableToolbarMessages.filterByTitle,
                { title: intl.formatMessage(requestsMessages.statusColumn).toLowerCase() }
              ),
              onChange: (_event, value) => handleFilterChange(value, 'decision'),
              value: filterValue.decision,
              items: [ 'approved', 'canceled', 'denied', 'error', 'undecided' ].map((state) => ({
                label: intl.formatMessage(requestsMessages[state]),
                value: state
              }))
            }
          }
        ] }
      />
    </Fragment>);
};

RequestsList.propTypes = {
  routes: PropTypes.func,
  persona: PropTypes.string,
  indexpath: PropTypes.shape ({ index: PropTypes.string }),
  actionResolver: PropTypes.func
};

RequestsList.defaultProps = {
  indexpath: routes.request,
  actionResolver: () => false
};

export default RequestsList;
