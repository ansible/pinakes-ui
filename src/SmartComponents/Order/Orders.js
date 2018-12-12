import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { fetchOrderList } from '../../redux/Actions/OrderActions';
import ContentList from '../ContentGallery/ContentList';
import propTypes from 'prop-types';

class Orders extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.fetchOrders();
  }

  render() {
    let orderList = {
      ...this.props.orderList,
      isLoading: this.props.isLoading
    };
    return (
      <div className="pf-l-stack__item pf-m-secondary ">
        <ContentList { ...orderList } />
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
  history: propTypes.object,
  fetchOrders: propTypes.func
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Orders)
);
