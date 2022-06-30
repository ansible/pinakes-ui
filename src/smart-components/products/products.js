import React, {
  useContext,
  useEffect,
  useReducer,
  Fragment,
  useState
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { WrenchIcon, SearchIcon } from '@patternfly/react-icons';

import { fetchPortfolioItems } from '../../redux/actions/portfolio-actions';
import { fetchPortfolioItems as fetchPortfolioItemsS } from '../../redux/actions/portfolio-actions-s';
import { isStandalone, scrollToTop } from '../../helpers/shared/helpers';
import PortfolioItem from '../portfolio/portfolio-item';
import createProductsToolbarSchema from '../../toolbar/schemas/products-toolbar.schema';
import ToolbarRenderer from '../../toolbar/toolbar-renderer';
import { defaultSettings } from '../../helpers/shared/pagination';
import ContentGallery from '../content-gallery/content-gallery';
import { fetchPlatforms } from '../../redux/actions/platform-actions';
import { fetchPlatforms as fetchPlatformsS } from '../../redux/actions/platform-actions-s';
import asyncFormValidator from '../../utilities/async-form-validator';
import ContentGalleryEmptyState from '../../presentational-components/shared/content-gallery-empty-state';
import {
  Button,
  TextContent,
  Text,
  TextVariants
} from '@patternfly/react-core';
import AppContext from '../../app-context';
import AsyncPagination from '../common/async-pagination';
import { PORTFOLIO_ITEM_ROUTE } from '../../constants/routes';
import BottomPaginationContainer from '../../presentational-components/shared/bottom-pagination-container';
import useInitialUriHash from '../../routing/use-initial-uri-hash';
import UserContext from '../../user-context';
import filteringMessages from '../../messages/filtering.messages';
import productsMessages from '../../messages/products.messages';
import platformsMessages from '../../messages/platforms.messages';
import useFormatMessage from '../../utilities/use-format-message';
import { CATALOG_ADMIN_ROLE } from '../../utilities/constants';

const debouncedFilter = asyncFormValidator(
  (value, dispatch, filteringCallback) => {
    filteringCallback(true);
    dispatch(
      isStandalone()
        ? fetchPortfolioItemsS(value, defaultSettings)
        : fetchPortfolioItems(value, defaultSettings)
    ).then(() => filteringCallback(false));
  },
  1000
);

const buildItemLink = ({ portfolio, id, service_offering_source_ref }) => {
  if (portfolio && id && service_offering_source_ref) {
    return {
      pathname: portfolio && PORTFOLIO_ITEM_ROUTE,
      searchParams: {
        portfolio,
        'portfolio-item': id,
        source: service_offering_source_ref,
        'from-products': 'true'
      }
    };
  }

  return {};
};

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
  const formatMessage = useFormatMessage();
  const viewState = useInitialUriHash();
  const { release } = useContext(AppContext);
  const [limit, setLimit] = useState(defaultSettings.limit);
  const [offset, setOffset] = useState(1);

  const [{ isFetching, filterValue, isFiltering }, stateDispatch] = useReducer(
    productsState,
    {
      ...initialState,
      filterValue: viewState?.products?.filter || ''
    }
  );
  const { userRoles: userRoles } = useContext(UserContext);
  const dispatch = useDispatch();
  const products = useSelector(
    ({ portfolioReducer: { portfolioItems } }) => portfolioItems
  );
  const meta = products.meta || { count: products.count, limit, offset };
  const data = products.data || products.results;
  useEffect(() => {
    Promise.all([
      dispatch(
        isStandalone()
          ? fetchPortfolioItemsS(
              viewState?.products?.filter,
              viewState?.products
            )
          : fetchPortfolioItems(
              viewState?.products?.filter,
              viewState?.products
            )
      ),
      dispatch(isStandalone() ? fetchPlatformsS() : fetchPlatforms())
    ]).then(() => stateDispatch({ type: 'setFetching', payload: false }));
    scrollToTop();
  }, []);

  const handleFilterItems = (value) => {
    stateDispatch({ type: 'setFilterValue', payload: value });
    debouncedFilter(value, dispatch, (isFiltering) =>
      stateDispatch({ type: 'setFilteringFlag', payload: isFiltering })
    );
  };

  const galleryItems = data.map((item) => (
    <PortfolioItem
      key={item.id}
      pathname={item.portfolio && PORTFOLIO_ITEM_ROUTE}
      {...buildItemLink(item)}
      {...item}
      toDisplay={['description']}
    />
  ));

  const SourcesAction = () =>
    userRoles?.includes(CATALOG_ADMIN_ROLE) && (
      <a href={`${release}settings/sources/new`}>
        <Button ouiaId={'add-source'} variant="primary">
          {formatMessage(productsMessages.addSource)}
        </Button>
      </a>
    );

  const FilterAction = () => (
    <Button
      ouiaId={'clear-filter'}
      variant="link"
      onClick={() => handleFilterItems('')}
    >
      {formatMessage(filteringMessages.clearFilters)}
    </Button>
  );

  const renderEmptyStateDescription = () => (
    <Fragment>
      <TextContent>
        <Text component={TextVariants.p}>
          {meta.noData
            ? formatMessage(productsMessages.configureSource)
            : formatMessage(filteringMessages.noResultsDescription)}
        </Text>
        {userRoles?.includes(CATALOG_ADMIN_ROLE) ? (
          <Text component={TextVariants.p}>
            {formatMessage(platformsMessages.connectSource, {
              // eslint-disable-next-line react/display-name
              a: (chunks) => (
                <Fragment>
                  <a href={`${document.baseURI}settings/sources`}>{chunks}</a>
                </Fragment>
              )
            })}
          </Text>
        ) : (
          <Text>{formatMessage(platformsMessages.contactAdmin)}</Text>
        )}
      </TextContent>
    </Fragment>
  );

  const emptyStateProps = {
    PrimaryAction: meta.noData ? SourcesAction : FilterAction,
    title: meta.noData
      ? formatMessage(filteringMessages.noProducts)
      : formatMessage(filteringMessages.noResults),
    renderDescription: renderEmptyStateDescription,
    Icon: meta.noData ? WrenchIcon : SearchIcon
  };

  return (
    <Fragment>
      <ToolbarRenderer
        schema={createProductsToolbarSchema({
          filterProps: {
            searchValue: filterValue,
            onFilterChange: handleFilterItems,
            placeholder: formatMessage(filteringMessages.filterByProduct)
          },
          title: formatMessage(productsMessages.title),
          isLoading: isFiltering || isFetching,
          meta,
          setLimit,
          setOffset,
          fetchProducts: isStandalone()
            ? (...args) => dispatch(fetchPortfolioItemsS(...args))
            : (...args) => dispatch(fetchPortfolioItems(...args))
        })}
      />
      <ContentGallery
        isLoading={isFiltering || isFetching}
        items={galleryItems}
        renderEmptyState={() => (
          <ContentGalleryEmptyState {...emptyStateProps} />
        )}
      />
      {meta.count > 0 && (
        <BottomPaginationContainer>
          <AsyncPagination
            dropDirection="up"
            meta={meta}
            setLimit={setLimit}
            setOffset={setOffset}
            apiRequest={(_e, options) =>
              dispatch(
                isStandalone()
                  ? fetchPortfolioItemsS(viewState?.products?.filter, options)
                  : fetchPortfolioItems(viewState?.products?.filter, options)
              )
            }
          />
        </BottomPaginationContainer>
      )}
    </Fragment>
  );
};

export default Products;
