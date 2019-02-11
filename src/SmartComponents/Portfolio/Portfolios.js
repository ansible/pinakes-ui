import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import propTypes from 'prop-types';
import { Route, Link } from 'react-router-dom';
import { Level, LevelItem, Text, TextContent, TextVariants, Button } from '@patternfly/react-core';
import ContentGallery from '../../SmartComponents/ContentGallery/ContentGallery';
import PortfolioCard from '../../PresentationalComponents/Portfolio/PorfolioCard';
import PortfoliosFilterToolbar from '../../PresentationalComponents/Portfolio/PortfoliosFilterToolbar';
import { fetchPortfolios } from '../../redux/Actions/PortfolioActions';
import { hideModal, showModal } from '../../redux/Actions/MainModalActions';
import AddPortfolio from './add-portfolio-modal';
import RemovePortfolio from './remove-portfolio-modal';
import './portfolio.scss';
import { scrollToTop } from '../../Helpers/Shared/helpers';

class Portfolios extends Component {
    state = {
      filteredItems: [],
      isOpen: false,
      filterValue: ''
    };

    fetchData = () => {
      this.props.fetchPortfolios();
    };

    componentDidMount() {
      this.fetchData();
      scrollToTop();
    }

    onFilterChange = filterValue => this.setState({ filterValue })

    renderToolbar() {
      return (
        <Level className="pf-u-pt-md pf-u-pr-xl pf-u-pl-xl">
          <LevelItem>
            <TextContent>
              <Text component={ TextVariants.h2 }>All Portfolios</Text>
            </TextContent>
          </LevelItem>
          <LevelItem>
            <Link to="/portfolios/add-portfolio">
              <Button
                variant="primary"
                aria-label="Create portfolio"
              >
                Create portfolio
              </Button>
            </Link>
          </LevelItem>
        </Level>
      );
    }

    render() {
      let filteredItems = {
        items: this.props.portfolios
        .filter(({ name }) => name.toLowerCase().includes(this.state.filterValue.trim().toLowerCase()))
        .map(item => <PortfolioCard key={ item.id } { ...item } />),
        isLoading: this.props.isLoading && this.props.portfolios.length === 0
      };

      return (
        <Fragment>
          <PortfoliosFilterToolbar onFilterChange={ this.onFilterChange } filterValue={ this.state.filterValue }/>
          <Route exact path="/portfolios/add-portfolio" component={ AddPortfolio } />
          <Route exact path="/portfolios/edit/:id" component={ AddPortfolio } />
          <Route exact path="/portfolios/remove/:id" component={ RemovePortfolio } />
          { this.renderToolbar() }
          <ContentGallery { ...filteredItems } />
        </Fragment>
      );
    }
}

const mapStateToProps = ({ portfolioReducer: { portfolios, isLoading, filterValue }}) => ({
  portfolios,
  isLoading,
  searchFilter: filterValue
});

const mapDispatchToProps = dispatch => {
  return {
    fetchPortfolios: apiProps => dispatch(fetchPortfolios(apiProps)),
    hideModal: () => dispatch(hideModal()),
    showModal: (modalProps, modalType) => {
      dispatch(showModal({ modalProps, modalType }));
    }
  };
};

Portfolios.propTypes = {
  filteredItems: propTypes.array,
  portfolios: propTypes.array,
  platforms: propTypes.array,
  isLoading: propTypes.bool,
  searchFilter: propTypes.string,
  showModal: propTypes.func,
  hideModal: propTypes.func,
  fetchPortfolios: propTypes.func.isRequired
};

Portfolios.defaultProps = {
  portfolios: []
};

export default connect(mapStateToProps, mapDispatchToProps)(Portfolios);
