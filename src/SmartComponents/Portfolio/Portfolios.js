import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import propTypes from 'prop-types';
import { Route, Link } from 'react-router-dom';
import { Toolbar, ToolbarGroup, ToolbarItem, Title, Button } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import spacingStyles from '@patternfly/patternfly-next/utilities/Spacing/spacing.css';
import flexStyles from '@patternfly/patternfly-next/utilities/Flex/flex.css';
import ContentGallery from '../../SmartComponents/ContentGallery/ContentGallery';
import PortfolioCard from '../../PresentationalComponents/Portfolio/PorfolioCard';
import PortfoliosFilterToolbar from '../../PresentationalComponents/Portfolio/PortfoliosFilterToolbar';
import { fetchPortfoliosIfNeeded } from '../../redux/Actions/PortfolioActions';
import { hideModal, showModal } from '../../redux/Actions/MainModalActions';
import AddPortfolio from './add-portfolio-modal';
import './portfolio.scss';
import { scrollToTop } from '../../Helpers/Shared/helpers';

class Portfolios extends Component {
    state = {
      filteredItems: [],
      isOpen: false
    };

    fetchData = () => {
      this.props.fetchPortfoliosIfNeeded();
    };

    componentDidMount() {
      this.fetchData();
      scrollToTop();
    }

    renderToolbar() {
      return (
        <Toolbar className={ css(flexStyles.justifyContentSpaceBetween, spacingStyles.mxXl, spacingStyles.myMd) }>
          <ToolbarGroup>
            <ToolbarItem className={ css(spacingStyles.mrXl) }>
              <Title size={ '2xl' }> All Portfolios</Title>
            </ToolbarItem>
          </ToolbarGroup>
          <ToolbarGroup  className={ 'pf-u-ml-auto-on-xl' }>
            <ToolbarItem>
              <Link to="/portfolios/add-portfolio">
                <Button
                  variant="primary"
                  aria-label="Create Portfolio"
                >
                Create Portfolio
                </Button>
              </Link>
            </ToolbarItem>
          </ToolbarGroup>
        </Toolbar>
      );
    }

    onClickCreatePortfolio = () => {
      this.props.showModal({
        open: true,
        closeModal: this.props.hideModal
      }, 'addportfolio');

      this.setState({
        ...this.state,
        isOpen: !this.state.isOpen
      });
    };

    render() {
      let filteredItems = {
        items: this.props.portfolios.map((item) => <PortfolioCard key={ item.id } { ...item } />),
        isLoading: this.props.isLoading && this.props.portfolios.length === 0
      };

      return (
        <Fragment>
          <PortfoliosFilterToolbar/>
          <Route exact path="/portfolios/add-portfolio" component={ AddPortfolio } />
          <Route exact path="/portfolios/edit/:id" component={ AddPortfolio } />
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
    fetchPortfoliosIfNeeded: apiProps => dispatch(fetchPortfoliosIfNeeded(apiProps)),
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
  fetchPortfoliosIfNeeded: propTypes.func.isRequired
};

Portfolios.defaultProps = {
  portfolios: []
};

export default connect(mapStateToProps, mapDispatchToProps)(Portfolios);
