import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  DataList,
  DataListItem,
  DataListCell,
  DataListToggle,
  DataListContent,
  Tabs,
  Tab,
  Text,
  TextVariants,
  TextContent
} from '@patternfly/react-core';
import { fetchOrderList } from '../../redux/Actions/OrderActions';
import propTypes from 'prop-types';
import OrdersToolbar from './orders-toolbar';
import './orders.scss';

class Orders extends Component {
  state = {
    orders: [],
    activeTabKey: 0,
    dataListExpanded: {}
  }

  componentDidMount() {
    this.props.fetchOrders()
    .then(() => this.setState({ orders: this.props.orderList.items.sort((a, b) => b.id - a.id) }));
  }

  handleTabClick = (_event, activeTabKey) => this.setState({ activeTabKey })

  handleDataItemToggle = id => this.setState(({ dataListExpanded }) => ({
    dataListExpanded: { ...dataListExpanded, [id]: !dataListExpanded[id] }
  }))

  renderDataListItems = data => data.map(item => (
    <DataListItem key={ item.id } aria-labelledby={ `${item.id}-expand` } isExpanded={ this.state.dataListExpanded[item.id] }>
      { data.id }
      <DataListToggle
        id={ item.id }
        aria-label={ `${item.id}-expand` }
        aria-labelledby={ `${item.id}-expand` }
        onClick={ () => this.handleDataItemToggle(item.id) }
        isExpanded={ this.state.dataListExpanded[item.id] }
      />
      <DataListCell>
        <TextContent>
          <Text component={ TextVariants.h4 }>Order { item.id }</Text>
          <Text style={ { marginBottom: 0 } } component={ TextVariants.small }>{ item.created_at.toString() }</Text>
        </TextContent>
      </DataListCell>
      <DataListCell className="order-cell" style={ { alignSelf: 'center' } }>
        <TextContent className="text-align-right">
          <Text component={ TextVariants.h5 }>{ item.state }</Text>
        </TextContent>
      </DataListCell>
      <DataListContent aria-label={ `${item.id}-content` } isHidden={ !this.state.dataListExpanded[item.id] }>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et
          dolore magna aliqua.
        </p>
      </DataListContent>
    </DataListItem>
  ))

  render() {
    const { isLoading } = this.props.isLoading;
    if (isLoading) {
      return <div>Loading</div>;
    }

    const { orders, activeTabKey } = this.state;

    return (
      <div>
        <OrdersToolbar />
        <div>
          <Tabs className="order-tabs" activeKey={ activeTabKey } onSelect={ this.handleTabClick }>
            <Tab eventKey={ 0 } title="My orders" className="pf-u-p-lg">
              <DataList aria-label="all-orders">
                { this.renderDataListItems(orders) }
              </DataList>
            </Tab>
            <Tab eventKey={ 1 } title="All orders" className="pf-u-p-lg">
              <DataList aria-label="all-orders">
                { this.renderDataListItems(orders) }
              </DataList>
            </Tab>
          </Tabs>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ orderReducer: { orders, isLoading }}) => ({
  orderList: {
    items: orders
  },
  isLoading
});

const mapDispatchToProps = dispatch => ({
  fetchOrders: () => dispatch(fetchOrderList())
});

Orders.propTypes = {
  orderList: propTypes.object,
  isLoading: propTypes.bool,
  searchFilter: propTypes.string,
  fetchOrders: propTypes.func
};

export default connect(mapStateToProps, mapDispatchToProps)(Orders);
