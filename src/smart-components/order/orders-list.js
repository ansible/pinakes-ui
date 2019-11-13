import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DataList, Level, LevelItem, Grid, GridItem } from '@patternfly/react-core';
import PropTypes from 'prop-types';
import { Route, withRouter } from 'react-router-dom';
import { Section } from '@redhat-cloud-services/frontend-components';

import { fetchOrders } from '../../redux/actions/order-actions';
import { fetchPlatforms } from '../../redux/actions/platform-actions';
import { ListLoader } from '../../presentational-components/shared/loader-placeholders';
import OrderItem from './order-item';
import FilterToolbarItem from '../../presentational-components/shared/filter-toolbar-item';
import AsyncPagination from '../common/async-pagination';
import { getOrderPortfolioName } from '../../helpers/shared/orders';
import OrderMessagesModal from './order-messages-modal';

const OrdersList = ({ match: { url }}) => {
  const [ isFetching, setFetching ] = useState(true);
  const [ searchValue, setSearchValue ] = useState('');
  const { data, meta } = useSelector(({ orderReducer }) => orderReducer.orders);
  const portfolioItems = useSelector(({ portfolioReducer: { portfolioItems }}) => portfolioItems.data);
  const dispatch = useDispatch();
  useEffect(() => {
    setFetching(true);
    Promise.all([ dispatch(fetchOrders()), dispatch(fetchPlatforms()) ])
    .then(() => setFetching(false));
  }, []);

  const handlePagination = (_apiProps, pagination) => {
    setFetching(true);
    dispatch(fetchOrders(pagination))
    .then(() => setFetching(false))
    .catch(() => setFetching(false));
  };

  return (
    <Grid gutter="md">
      <GridItem>
        <Section type="content">
          <Route path={ `${url}/:orderItemId/messages` } render={ (props) => <OrderMessagesModal closeUrl={ url } { ...props } /> } />
          <div className="pf-u-pb-md pf-u-pl-xl pf-u-pr-xl orders-list">
            <Level>
              <LevelItem className="pf-u-mt-md">
                <FilterToolbarItem searchValue={ searchValue } onFilterChange={ value => setSearchValue(value) } placeholder="Filter by name..." />
              </LevelItem>
              <LevelItem>
                <AsyncPagination isDisabled={ isFetching } apiRequest={ handlePagination } meta={ meta } />
              </LevelItem>
            </Level>
          </div>
          <DataList aria-label="order-list">
            { isFetching
              ? <ListLoader />
              : data
              .filter(item => getOrderPortfolioName(item, portfolioItems).toLowerCase().includes(searchValue.toLowerCase()))
              .map((item, index) => (
                <OrderItem
                  key={ item.id }
                  index={ index }
                  item={ item }
                />
              )) }
          </DataList>
        </Section>
      </GridItem>
    </Grid>
  );
};

OrdersList.propTypes = {
  type: PropTypes.oneOf([ 'openOrders', 'closedOrders' ]).isRequired,
  match: PropTypes.shape({
    url: PropTypes.string.isRequired
  }).isRequired
};

export default withRouter(OrdersList);
