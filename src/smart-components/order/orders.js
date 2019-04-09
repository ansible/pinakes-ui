import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  DataList,
  DataListItem,
  DataListCell,
  DataListToggle,
  DataListContent,
  Grid,
  GridItem,
  Level,
  LevelItem,
  Progress,
  ProgressMeasureLocation,
  Text,
  TextVariants,
  TextContent,
  Split,
  SplitItem
} from '@patternfly/react-core';
import PropTypes from 'prop-types';
import { Section } from '@red-hat-insights/insights-frontend-components';

import OrdersToolbar from './orders-toolbar';
import { getLinkedOrders } from '../../redux/actions/order-actions';
import CardIcon from '../../presentational-components/shared/card-icon';
import { fetchPortfolioItems } from '../../redux/actions/portfolio-actions';

import './orders.scss';
import { CATALOG_API_BASE } from '../../utilities/constants';
import { createOrderedLabel, createUpdatedLabel } from '../../helpers/shared/helpers';

const getOrderIcon = ({ orderItems }) => orderItems[0] && `${CATALOG_API_BASE}/portfolio_items/${orderItems[0].portfolio_item_id}/icon`;

const getOrderPortfolioName = ({ orderItems, id }, portfolioItems) => {
  const portfolioItem = orderItems[0] && portfolioItems.find(({ id }) => orderItems[0].portfolio_item_id === id);
  return portfolioItem ? portfolioItem.display_name || portfolioItem.name : `Order ${id}`;
};

const OrderSteps = ({ requests }) => (
  <Progress
    style={ { minWidth: 200 } }
    value={ requests.length }
    title="Steps"
    size="sm"
    min={ 0 }
    max={ 4 }
    label={ `${requests.length} of 4` }
    measureLocation={ ProgressMeasureLocation.top }
  />);

const StepLabel = ({ index, text }) => (
  <div className="requests-step-label">
    <span>{ index + 1 }</span>
    <span>{ text }</span>
  </div>
);

const OrderDetailTab = ({ requests }) => (
  <table className="requests-table">
    <thead>
      <tr>
        <th>
          Steps
        </th>
        <th>
          Performed by
        </th>
        <th>
          Date &amp; time
        </th>
        <th>
          Status
        </th>
      </tr>
    </thead>
    <tbody>
      { requests.map(({ reason, requester, updated_at, state }, index) => (
        <tr key={ index } className={ state }>
          <td><StepLabel index={ index } text={ reason } /></td>
          <td>{ requester }</td>
          <td>{ new Date(updated_at).toLocaleDateString() }</td>
          <td>{ state }</td>
        </tr>
      )) }
    </tbody>
  </table>
);

class Orders extends Component {
  state = {
    dataListExpanded: {}
  }

  componentDidMount() {
    this.props.getLinkedOrders();
    this.props.fetchPortfolioItems();
  }

  handleTabClick = (_event, activeTabKey) => this.setState({ activeTabKey })

  handleDataItemToggle = id => this.setState(({ dataListExpanded }) => ({
    dataListExpanded: { ...dataListExpanded, [id]: !dataListExpanded[id] }
  }))

  renderDataListItems = data => data.map(item => (
    <DataListItem
      key={ item.id }
      aria-labelledby={ `${item.id}-expand` }
      isExpanded={ this.state.dataListExpanded[item.id] }
      className="data-list-expand-fix"
    >
      <DataListToggle
        id={ item.id }
        aria-label={ `${item.id}-expand` }
        aria-labelledby={ `${item.id}-expand` }
        onClick={ () => this.handleDataItemToggle(item.id) }
        isExpanded={ this.state.dataListExpanded[item.id] }
      />
      <DataListCell className="cell-grow">
        <Split gutter="md">
          <SplitItem>
            <CardIcon src={ getOrderIcon(item) } />
          </SplitItem>
          <SplitItem isMain>
            <TextContent>
              <Grid gutter="sm" style={ { gridGap: 16 } }>
                <GridItem>
                  <Text
                    style={ { marginBottom: 0 } }
                    component={ TextVariants.h5 }
                  >
                    { getOrderPortfolioName(item, this.props.portfolioItems) }
                  </Text>
                </GridItem>
                <GridItem>
                  <Level>
                    <LevelItem>
                      <Text
                        style={ { marginBottom: 0 } }
                        component={ TextVariants.small }
                      >
                        { `${createOrderedLabel(new Date(item.ordered_at))}` }
                      </Text>
                    </LevelItem>
                    <LevelItem>
                      <Text
                        style={ { marginBottom: 0 } }
                        component={ TextVariants.small }
                      >
                            Ordered by
                      </Text>
                    </LevelItem>
                    <LevelItem>
                      <Text
                        style={ { marginBottom: 0 } }
                        component={ TextVariants.small }
                      >
                        { `${createUpdatedLabel(item.orderItems)}` }
                      </Text>
                    </LevelItem>
                  </Level>
                </GridItem>
              </Grid>
            </TextContent>
          </SplitItem>
        </Split>
      </DataListCell>
      <DataListCell className="order-cell" style={ { alignSelf: 'center' } }>
        <OrderSteps requests={ item.requests } />
      </DataListCell>
      <DataListContent
        style={ { paddingLeft: 0, paddingRight: 0 } }
        aria-label={ `${item.id}-content` }
        isHidden={ !this.state.dataListExpanded[item.id] }
      >
        <OrderDetailTab requests={ item.requests } />
      </DataListContent>
    </DataListItem>
  ))

  render() {
    const { isLoading, linkedOrders: { current, past }} = this.props;
    if (isLoading) {
      return <div>Loading</div>;
    }

    return (
      <Fragment>
        <OrdersToolbar />
        <Section type="content">
          <TextContent>
            <Text component="h2">Current orders</Text>
          </TextContent>
          <DataList>
            { this.renderDataListItems(current) }
          </DataList>
          <TextContent>
            <Text component="h2">Past orders</Text>
          </TextContent>
          <DataList>
            { this.renderDataListItems(past) }
          </DataList>
        </Section>
      </Fragment>
    );
  }
}

const mapStateToProps = ({ orderReducer: { linkedOrders, isLoading }, portfolioReducer: { portfolioItems, isLoading: portfolioLoading }}) => ({
  linkedOrders,
  isLoading: isLoading || portfolioLoading,
  portfolioItems
});

const mapDispatchToProps = dispatch => bindActionCreators({
  getLinkedOrders,
  fetchPortfolioItems
}, dispatch);

Orders.propTypes = {
  linkedOrders: PropTypes.shape({
    current: PropTypes.arrayOf(PropTypes.object).isRequired,
    past: PropTypes.arrayOf(PropTypes.object).isRequired
  }).isRequired,
  isLoading: PropTypes.bool,
  getLinkedOrders: PropTypes.func.isRequired,
  fetchPortfolioItems: PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(Orders);
