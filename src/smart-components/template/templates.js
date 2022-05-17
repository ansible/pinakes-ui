import React, {
  Fragment,
  useEffect,
  useReducer,
  useRef,
  useState
} from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { Route, Link, useHistory } from 'react-router-dom';
import {
  ToolbarGroup,
  ToolbarItem,
  Button,
  Checkbox
} from '@patternfly/react-core';
import { PlusCircleIcon, SearchIcon } from '@patternfly/react-icons';
import { truncate, cellWidth } from '@patternfly/react-table';
import {
  clearFilterValueTemplates,
  fetchTemplates,
  setFilterValueTemplates
} from '../../redux/actions/template-actions';
import AddTemplate from './add-template-modal';
import RemoveTemplate from './remove-template-modal';
import { createRows } from './template-table-helpers';
import { TableToolbarView } from '../../presentational-components/shared/approval-table-toolbar-view';
import {
  TopToolbar,
  TopToolbarTitle
} from '../../presentational-components/shared/approval-top-toolbar';
import { AppTabs } from '../app-tabs/app-tabs';
import { defaultSettings } from '../../helpers/shared/approval-pagination';
import asyncDebounce from '../../utilities/async-form-validator';
import TableEmptyState from '../../presentational-components/shared/approval-table-empty-state';
import routesLinks from '../../constants/approval-routes';
import { useIntl } from 'react-intl';
import commonMessages from '../../messages/common.message';
import templateMessages from '../../messages/templates.messages';
import formMessages from '../../messages/form.messages';
import tableToolbarMessages from '../../messages/table-toolbar.messages';
import EditTemplate from './edit-template-modal';
import TemplateTableContext from './template-table-context';
import isEmpty from 'lodash/isEmpty';

const columns = (intl, selectedAll, selectAll) => [
  {
    title: (
      <Checkbox onChange={selectAll} isChecked={selectedAll} id="select-all" />
    ),
    transforms: [cellWidth(1)]
  },
  {
    title: intl.formatMessage(tableToolbarMessages.name)
  },
  {
    title: intl.formatMessage(formMessages.description),
    transforms: [cellWidth(30)],
    cellTransforms: [truncate]
  },
  {
    title: intl.formatMessage(tableToolbarMessages.updatedLabel)
  }
];

const debouncedFilter = asyncDebounce(
  (filter, dispatch, filteringCallback, meta = defaultSettings) => {
    filteringCallback(true);
    dispatch(setFilterValueTemplates(filter, meta));
    return dispatch(fetchTemplates(meta)).then(() => filteringCallback(false));
  },
  1000
);

const prepareChips = (filterValue, intl) =>
  filterValue
    ? [
        {
          category: intl.formatMessage(tableToolbarMessages.name),
          key: 'name',
          chips: [{ name: filterValue, value: filterValue }]
        }
      ]
    : [];

const initialState = (filterValue = '') => ({
  filterValue,
  isFetching: true,
  isFiltering: false,
  selectedTemplates: [],
  selectedAll: false,
  rows: []
});

const areSelectedAll = (rows = [], selected) =>
  rows.every((row) => selected.includes(row.id));

const unique = (value, index, self) => self.indexOf(value) === index;

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const templatesListState = (state, action) => {
  switch (action.type) {
    case 'setRows':
      return {
        ...state,
        rows: action.payload,
        selectedAll: areSelectedAll(action.payload, state.selectedTemplates)
      };
    case 'setFetching':
      return {
        ...state,
        isFetching: action.payload
      };
    case 'setFilterValue':
      return { ...state, filterValue: action.payload };
    case 'select':
      return {
        ...state,
        selectedAll: false,
        selectedTemplates: state.selectedTemplates.includes(action.payload)
          ? state.selectedTemplates.filter((id) => id !== action.payload)
          : [...state.selectedTemplates, action.payload]
      };
    case 'selectAll':
      return {
        ...state,
        selectedTemplates: [
          ...state.selectedTemplates,
          ...action.payload
        ].filter(unique),
        selectedAll: true
      };
    case 'unselectAll':
      return {
        ...state,
        selectedTemplates: state.selectedTemplates.filter(
          (selected) => !action.payload.includes(selected)
        ),
        selectedAll: false
      };
    case 'resetSelected':
      return {
        ...state,
        selectedTemplates: [],
        selectedAll: false
      };
    case 'setFilteringFlag':
      return {
        ...state,
        isFiltering: action.payload
      };
    case 'clearFilters':
      return { ...state, filterValue: '', isFetching: true };
    default:
      return state;
  }
};

const Templates = () => {
  const { templates, filterValueRedux } = useSelector(
    ({ templateReducer: { templates, filterValue: filterValueRedux } }) => ({
      templates,
      filterValueRedux
    }),
    shallowEqual
  );
  const [limit, setLimit] = useState(defaultSettings.limit);
  const [offset, setOffset] = useState(1);

  const data = templates?.data;
  const meta = templates?.meta || { count: templates.count, limit, offset };
  const [
    {
      filterValue,
      isFetching,
      isFiltering,
      selectedTemplates,
      selectedAll,
      rows
    },
    stateDispatch
  ] = useReducer(templatesListState, initialState(filterValueRedux));

  const dispatch = useDispatch();
  const history = useHistory();
  const intl = useIntl();

  const setSelectedTemplates = (id) =>
    stateDispatch({ type: 'select', payload: id });

  const updateTemplates = (pagination) => {
    stateDispatch({ type: 'setFetching', payload: true });
    return dispatch(fetchTemplates(pagination))
      .then(() => stateDispatch({ type: 'setFetching', payload: false }))
      .catch(() => stateDispatch({ type: 'setFetching', payload: false }));
  };

  useEffect(() => {
    updateTemplates(defaultSettings);
  }, []);

  useEffect(() => {
    stateDispatch({ type: 'setRows', payload: createRows(data) });
  }, [data]);

  const clearFilters = () => {
    stateDispatch({ type: 'clearFilters' });
    dispatch(clearFilterValueTemplates());
    return updateTemplates(meta);
  };

  const handleFilterChange = (value) => {
    !value || value === ''
      ? clearFilters()
      : stateDispatch({ type: 'setFilterValue', payload: value });
    debouncedFilter(
      value,
      dispatch,
      (isFiltering) =>
        stateDispatch({ type: 'setFilteringFlag', payload: isFiltering }),
      { ...meta, offset: 0 }
    );
  };

  const routes = () => (
    <Fragment>
      <Route
        exact
        path={routesLinks.templates.add}
        render={(props) => (
          <AddTemplate {...props} postMethod={updateTemplates} />
        )}
      />
      <Route
        exact
        path={routesLinks.templates.edit}
        render={(props) => (
          <EditTemplate
            {...props}
            postMethod={updateTemplates}
            pagination={meta}
          />
        )}
      />
      <Route
        exact
        path={routesLinks.templates.remove}
        render={(props) => (
          <RemoveTemplate
            {...props}
            ids={selectedTemplates}
            fetchData={updateTemplates}
            pagination={meta}
            resetSelectedTemplates={() =>
              stateDispatch({ type: 'resetSelected' })
            }
          />
        )}
      />
    </Fragment>
  );

  const actionResolver = () => [
    {
      title: intl.formatMessage(templateMessages.edit),
      component: 'button',
      onClick: (_event, _rowId, template) =>
        history.push({
          pathname: routesLinks.templates.edit,
          search: `?template=${template.id}`
        })
    },
    {
      title: intl.formatMessage(commonMessages.delete),
      component: 'button',
      onClick: (_event, _rowId, template) =>
        history.push({
          pathname: routesLinks.templates.remove,
          search: `?template=${template.id}`
        })
    }
  ];

  const selectAllFunction = () =>
    selectedAll
      ? stateDispatch({ type: 'unselectAll', payload: data.map((wf) => wf.id) })
      : stateDispatch({ type: 'selectAll', payload: data.map((wf) => wf.id) });

  const anyTemplatesSelected = selectedTemplates.length > 0;

  const toolbarButtons = () => (
    <ToolbarGroup className={`pf-u-pl-lg top-toolbar`}>
      <ToolbarItem>
        <Link
          id="add-template-link"
          to={{ pathname: routesLinks.templates.add }}
        >
          <Button
            ouiaId={'add-template-link'}
            variant="primary"
            aria-label={intl.formatMessage(formMessages.create)}
          >
            {intl.formatMessage(formMessages.create)}
          </Button>
        </Link>
      </ToolbarItem>
      <ToolbarItem>
        <Link
          id="remove-multiple-templates"
          className={anyTemplatesSelected ? '' : 'disabled-link'}
          to={{ pathname: routesLinks.templates.remove }}
        >
          <Button
            variant="secondary"
            isDisabled={!anyTemplatesSelected}
            aria-label={intl.formatMessage(
              templateMessages.deleteTemplateTitle
            )}
          >
            {intl.formatMessage(commonMessages.delete)}
          </Button>
        </Link>
      </ToolbarItem>
    </ToolbarGroup>
  );

  return (
    <Fragment>
      <TopToolbar>
        <TopToolbarTitle
          title={intl.formatMessage(commonMessages.approvalTitle)}
        />
        <AppTabs />
      </TopToolbar>
      <TemplateTableContext.Provider
        value={{
          selectedTemplates,
          setSelectedTemplates
        }}
      >
        <TableToolbarView
          ouiaId={'templates-table'}
          rows={rows}
          columns={columns(intl, selectedAll, selectAllFunction)}
          fetchData={updateTemplates}
          routes={routes}
          actionResolver={actionResolver}
          titlePlural={intl.formatMessage(templateMessages.templates)}
          titleSingular={intl.formatMessage(templateMessages.template)}
          pagination={meta}
          setOffset={setOffset}
          setLimit={setLimit}
          toolbarButtons={toolbarButtons}
          filterValue={filterValue}
          onFilterChange={handleFilterChange}
          isLoading={isFetching || isFiltering}
          renderEmptyState={() => (
            <TableEmptyState
              title={
                filterValue === ''
                  ? intl.formatMessage(templateMessages.noTemplates)
                  : intl.formatMessage(tableToolbarMessages.noResultsFound)
              }
              icon={isEmpty(filterValue) ? PlusCircleIcon : SearchIcon}
              PrimaryAction={() =>
                filterValue !== '' ? (
                  <Button onClick={() => clearFilters()} variant="link">
                    {intl.formatMessage(tableToolbarMessages.clearAllFilters)}
                  </Button>
                ) : (
                  <Link
                    id="create-template-link"
                    to={{ pathname: routesLinks.templates.add }}
                  >
                    <Button
                      ouiaId={'create-template-link'}
                      variant="primary"
                      aria-label={intl.formatMessage(
                        templateMessages.createTemplate
                      )}
                    >
                      {intl.formatMessage(templateMessages.createTemplate)}
                    </Button>
                  </Link>
                )
              }
              description={
                filterValue === ''
                  ? intl.formatMessage(templateMessages.noTemplates)
                  : intl.formatMessage(
                      tableToolbarMessages.clearAllFiltersDescription
                    )
              }
              isSearch={!isEmpty(filterValue)}
            />
          )}
          activeFiltersConfig={{
            filters: prepareChips(filterValue, intl),
            onDelete: () => handleFilterChange('')
          }}
        />
      </TemplateTableContext.Provider>
    </Fragment>
  );
};

export default Templates;
