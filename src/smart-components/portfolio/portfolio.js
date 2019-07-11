import React, { useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter, Route, Switch } from 'react-router-dom';

import PortfolioItem from './portfolio-item';
import PortolioItems from './portfolio-items';
import { scrollToTop } from '../../helpers/shared/helpers';
import AddProductsToPortfolio from './add-products-to-portfolio';
import { defaultSettings } from '../../helpers/shared/pagination';
import { filterServiceOffering } from '../../helpers/shared/helpers';
import { toggleArraySelection } from '../../helpers/shared/redux-mutators';
import PortfolioItemDetail from './portfolio-item-detail/portfolio-item-detail';
import {
  copyPortfolio,
  fetchPortfolios,
  fetchSelectedPortfolio,
  removeProductsFromPortfolio,
  fetchPortfolioItemsWithPortfolio
} from '../../redux/actions/portfolio-actions';

const initialState = {
  selectedItems: [],
  removeInProgress: false,
  filterValue: '',
  copyInProgress: false,
  isFetching: false
};

const porftolioUiReducer = (state, { type, payload }) => ({
  selectItem: ({ ...state, selectedItems: toggleArraySelection(state.selectedItems, payload) }),
  setRemoveInProgress: ({ ...state, removeInProgress: payload }),
  removeSucessfull: ({ ...state, selectedItems: [], removeInProgress: false }),
  setFilterValue: ({ ...state, filterValue: payload }),
  setCopyInProgress: ({ ...state, copyInProgress: payload }),
  setIsFetching: ({ ...state, isFetching: payload })
})[type];

const Portfolio = props => {
  const [{ copyInProgress, isFetching, filterValue, removeInProgress, selectedItems }, dispatch ] = useReducer(porftolioUiReducer, initialState);

  const fetchData = (apiProps) => {
    dispatch({ type: 'setIsFetching', payload: true });
    Promise.all([
      props.fetchSelectedPortfolio(apiProps),
      props.fetchPortfolioItemsWithPortfolio(apiProps, defaultSettings)
    ])
    .then(() => dispatch({ type: 'setIsFetching', payload: false }))
    .catch(() => dispatch({ type: 'setIsFetching', payload: false }));
  };

  useEffect(() => {
    fetchData(props.match.params.id);
    scrollToTop();;
  }, [ props.match.params.id ]);

  const copyPortfolio = () => {
    dispatch({ type: 'setCopyInProgress', payload: true });
    return props.copyPortfolio(props.match.params.id)
    .then(({ id }) => props.history.push(`/portfolios/detail/${id}`))
    .then(() => dispatch({ type: 'setCopyInProgress', payload: false }))
    .then(() => props.fetchPortfolios())
    .catch(() => dispatch({ type: 'setCopyInProgress', payload: false }));
  };

  const removeProducts = products => {
    dispatch({ type: 'setRemoveInProgress', payload: true });
    props.removeProductsFromPortfolio(products, props.portfolio.name)
    .then(() => dispatch({ type: 'removeSucessfull' }))
    .catch(() => dispatch({ type: 'setRemoveInProgress', payload: false }));
  };

  const handleItemSelect = selectedItem => dispatch({ type: 'selectItem', payload: selectedItem });

  const handleFilterChange = filterValue => dispatch({ type: 'setFilterValue', payload: filterValue });

  const routes = {
    portfolioRoute: props.match.url,
    addProductsRoute: `${props.match.url}/add-products`,
    editPortfolioRoute: `${props.match.url}/edit-portfolio`,
    removePortfolioRoute: `${props.match.url}/remove-portfolio`,
    sharePortfolioRoute: `${props.match.url}/share-portfolio`,
    orderUrl: `${props.match.url}/product`
  };

  const title = props.portfolio ? props.portfolio.name : '';

  const galleryItems = {
    items: props.portfolioItems
    .filter(item => filterServiceOffering(item, filterValue))
    .map(item => (
      <PortfolioItem
        key={ item.id }
        { ...item }
        isSelectable
        onSelect={ handleItemSelect }
        isSelected={ selectedItems.includes(item.id) }
        orderUrl={ `${routes.orderUrl}/${item.id}` }
        removeInProgress={ removeInProgress }
      />
    )),
    isLoading: isFetching || props.isLoading
  };
  return (
    <Switch>
      <Route
        path={ routes.addProductsRoute }
        render={ props => (<AddProductsToPortfolio portfolio={ props.portfolio } portfolioRoute={ routes.portfolioRoute }/>) }
      />
      <Route path={ `${routes.orderUrl}/:portfolioItemId` } component={ PortfolioItemDetail }/>
      <Route
        path={ routes.portfolioRoute }
        render={ args => (
          <PortolioItems
            { ...routes }
            { ...args }
            selectedItems={ selectedItems }
            filteredItems={ galleryItems }
            title={ title }
            filterValue={ filterValue }
            handleFilterChange={ handleFilterChange }
            isLoading={ isFetching }
            copyInProgress={ copyInProgress }
            removeProducts={ removeProducts }
            copyPortfolio={ copyPortfolio }
            fetchPortfolioItemsWithPortfolio={ props.fetchPortfolioItemsWithPortfolio }
            portfolio={ props.portfolio }
            pagination={ props.pagination }
          />
        ) }
      />
    </Switch>
  );
};

const mapStateToProps = ({ portfolioReducer: { selectedPortfolio, portfolioItems, isLoading }}) => ({
  portfolio: selectedPortfolio,
  portfolioItems: portfolioItems.data,
  pagination: portfolioItems.meta,
  isLoading
});

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchPortfolioItemsWithPortfolio,
  fetchSelectedPortfolio,
  removeProductsFromPortfolio,
  fetchPortfolios,
  copyPortfolio
}, dispatch);

Portfolio.propTypes = {
  fetchPortfolioItemsWithPortfolio: PropTypes.func,
  fetchSelectedPortfolio: PropTypes.func,
  match: PropTypes.object,
  fetchPortfolios: PropTypes.func.isRequired,
  portfolio: PropTypes.shape({
    name: PropTypes.string,
    id: PropTypes.string
  }),
  location: PropTypes.object,
  history: PropTypes.object,
  portfolioItems: PropTypes.array,
  removeProductsFromPortfolio: PropTypes.func.isRequired,
  copyPortfolio: PropTypes.func.isRequired,
  pagination: PropTypes.object,
  isLoading: PropTypes.bool
};

Portfolio.defaultProps = {
  portfolioItems: [],
  portfolio: {}
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Portfolio));
