import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Route, Switch } from 'react-router-dom';
import { SearchIcon } from '@patternfly/react-icons';

import Portfolio from './portfolio';
import AddPortfolio from './add-portfolio-modal';
import SharePortfolio from './share-portfolio-modal';
import RemovePortfolio from './remove-portfolio-modal';
import { scrollToTop } from '../../helpers/shared/helpers';
import ToolbarRenderer from '../../toolbar/toolbar-renderer';
import ContentGallery from '../content-gallery/content-gallery';
import { defaultSettings } from '../../helpers/shared/pagination';
import { fetchPortfolios } from '../../redux/actions/portfolio-actions';
import PortfolioCard from '../../presentational-components/portfolio/porfolio-card';
import createPortfolioToolbarSchema from '../../toolbar/schemas/portfolios-toolbar.schema';
import ContentGalleryEmptyState, { EmptyStatePrimaryAction } from '../../presentational-components/shared/content-gallery-empty-state';

const portfoliosRoutes = {
  portfolios: '',
  detail: 'detail/:id'
};

class Portfolios extends Component {
  state = {
    filteredItems: [],
    isOpen: false,
    filterValue: ''
  };

  fetchData = () => {
    this.props.fetchPortfolios(undefined, defaultSettings);
  };

  componentDidMount() {
    this.fetchData();
    scrollToTop();
  }

  onFilterChange = filterValue => this.setState({ filterValue })

  renderItems = props => {
    let filteredItems = {
      items: this.props.portfolios
      .filter(({ name }) => name.toLowerCase().includes(this.state.filterValue.trim().toLowerCase()))
      .map(item => <PortfolioCard key={ item.id } { ...item } />),
      isLoading: this.props.isLoading && this.props.portfolios.length === 0
    };
    return (
      <Fragment>
        <ToolbarRenderer
          schema={ createPortfolioToolbarSchema({
            meta: this.props.pagination || {},
            fetchPortfolios: this.props.fetchPortfolios,
            filterProps: {
              searchValue: this.state.filterValue,
              onFilterChange: this.onFilterChange,
              placeholder: 'Filter by name...'
            }}) }
        />
        <Route { ...props } exact path="/portfolios/add-portfolio" component={ AddPortfolio } />
        <Route exact path="/portfolios/edit/:id" component={ AddPortfolio } />
        <Route exact path="/portfolios/remove/:id" component={ RemovePortfolio } />
        <Route exact path="/portfolios/share/:id" component={ SharePortfolio } />
        <ContentGallery { ...filteredItems } renderEmptyState={ () => (
          <ContentGalleryEmptyState
            title="No portfolios"
            Icon={ SearchIcon }
            description="You haven’t created a portfolio yet."
            PrimaryAction={ () => <EmptyStatePrimaryAction url="/portfolios/add-portfolio" label="Create portfolio" /> }
          />
        ) } />
      </Fragment>
    );
  }

  render() {
    return (
      <Switch>
        <Route path={ `/portfolios/${portfoliosRoutes.detail}` } component={ Portfolio } />
        <Route path={ `/portfolios/${portfoliosRoutes.portfolios}` } render={ this.renderItems } />
      </Switch>
    );
  }
}

const mapStateToProps = ({ portfolioReducer: { portfolios, isLoading, filterValue }}) => ({
  portfolios: portfolios.data,
  pagination: portfolios.meta,
  isLoading,
  searchFilter: filterValue
});

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchPortfolios
}, dispatch);

Portfolios.propTypes = {
  filteredItems: PropTypes.array,
  portfolios: PropTypes.array,
  platforms: PropTypes.array,
  isLoading: PropTypes.bool,
  searchFilter: PropTypes.string,
  showModal: PropTypes.func,
  fetchPortfolios: PropTypes.func.isRequired,
  pagination: PropTypes.object
};

Portfolios.defaultProps = {
  portfolios: [],
  pagination: {}
};

export default connect(mapStateToProps, mapDispatchToProps)(Portfolios);
