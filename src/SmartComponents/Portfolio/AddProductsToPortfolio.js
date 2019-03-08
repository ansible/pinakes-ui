import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import propTypes from 'prop-types';
import { Section } from '@red-hat-insights/insights-frontend-components';
import { addNotification } from '@red-hat-insights/insights-frontend-components/components/Notifications';
import { fetchMultiplePlatformItems, fetchPlatforms } from '../../redux/Actions/PlatformActions';
import ContentGallery from '../../SmartComponents/ContentGallery/ContentGallery';
import '../Platform/platform.scss';
import '../../SmartComponents/Portfolio/portfolio.scss';
import PortfolioOrderToolbar from '../../PresentationalComponents/Portfolio/PortfolioOrderToolbar';
import PlatformDashboard from '../../PresentationalComponents/Platform/PlatformDashboard';
import { addToPortfolio, fetchPortfolioItemsWithPortfolio } from '../../redux/Actions/PortfolioActions';
import PlatformItem from '../../PresentationalComponents/Platform/PlatformItem';
import { filterServiceOffering } from '../../Helpers/Shared/helpers';

class AddProductsToPortfolio extends Component {
    state = {
      selectedPlatforms: [],
      checkedItems: [],
      searchValue: ''
    };

    handleFilterChange = searchValue => this.setState({ searchValue })

    componentDidMount() {
      this.props.fetchPlatforms();
    }

    onPlatformSelectionChange = (selectedValues = []) =>
      this.setState(
        () => ({ selectedPlatforms: selectedValues }),
        () => this.props.fetchMultiplePlatformItems(selectedValues.filter(({ id }) =>
          !this.props.platformItems.hasOwnProperty(id)).map(({ id }) => id)));

    onToggleItemSelect = checkedId => this.setState(({ checkedItems }) => {
      const index = checkedItems.indexOf(checkedId);
      if (index > -1) {
        return { checkedItems: [
          ...checkedItems.slice(0, index),
          ...checkedItems.slice(index + 1)
        ]};
      }

      return { checkedItems: [ ...checkedItems, checkedId ]};
    })

    onAddToPortfolio = () =>
      this.props.addToPortfolio(this.props.portfolio.id, this.state.checkedItems)
      .then(() => this.props.history.push(this.props.portfolioRoute))
      .then(() => this.props.fetchPortfolioItemsWithPortfolio(this.props.portfolio.id));

    itemsSelected = () => this.state.checkedItems.length > 0;

    createItems = () => {
      const { selectedPlatforms } = this.state;
      const { platformItems } = this.props;
      return selectedPlatforms.map(({ id }) => platformItems[id]
        ? platformItems[id].data.filter(item => filterServiceOffering(item, this.state.searchValue)).map(item =>
          <PlatformItem
            key={ item.id }
            { ...item }
            editMode
            onToggleItemSelect={ () => this.onToggleItemSelect(item.id) }
            checked={ this.state.checkedItems.includes(item.id) }
          />)
        : null);
    }

    render() {
      let filteredItems = [];
      if (this.props.platformItems) {
        filteredItems = {
          items: this.createItems(),
          isLoading: this.props.isLoading && this.props.platformItems === 0
        };
      }

      let title = (this.props.portfolio) ? this.props.portfolio.name : '';
      return (
        <Section>
          <PortfolioOrderToolbar
            portfolioName={ title }
            onClickAddToPortfolio = { this.onAddToPortfolio }
            itemsSelected = { this.itemsSelected() }
            portfolioRoute={ this.props.portfolioRoute }
            searchValue={ this.state.searchValue }
            onFilterChange={ this.handleFilterChange }
            onOptionSelect={ this.onPlatformSelectionChange }
            options={ this.props.platforms.map(platform => ({ value: platform.id, label: platform.name, id: platform.id })) }
          />
          { (this.state.selectedPlatforms.length > 0) &&
            this.state.selectedPlatforms.map(platform => (
              <ContentGallery
                key={ platform.label }
                { ...filteredItems }
                title={ platform.name }
                editMode = { true }
                onToggleSelect = { this.onToggleItemSelect }
                checkedItems = { this.state.checkedItems }
              />
            )) }
          { (this.state.selectedPlatforms.length < 1) && <PlatformDashboard/> }
        </Section>
      );
    }
}

const mapStateToProps = ({ platformReducer: { platformItems, isPlatformDataLoading, platforms }}) => ({
  platformItems,
  isLoading: isPlatformDataLoading,
  platforms
});

const mapDispatchToProps = dispatch => bindActionCreators({
  addNotification,
  fetchMultiplePlatformItems,
  addToPortfolio,
  fetchPortfolioItemsWithPortfolio,
  fetchPlatforms
}, dispatch);

AddProductsToPortfolio.propTypes = {
  platformItems: propTypes.object,
  isLoading: propTypes.bool,
  isEditMode: propTypes.bool,
  addToPortfolio: propTypes.func,
  fetchMultiplePlatformItems: propTypes.func,
  portfolio: propTypes.shape({
    name: propTypes.string,
    id: propTypes.oneOfType([ propTypes.string, propTypes.number ]).isRequired
  }).isRequired,
  history: propTypes.shape({
    push: propTypes.func.isRequired
  }).isRequired,
  portfolioRoute: propTypes.string.isRequired,
  fetchPortfolioItemsWithPortfolio: propTypes.func.isRequired,
  platforms: propTypes.arrayOf(propTypes.shape({
    name: propTypes.string.isRequired,
    id: propTypes.oneOfType([ propTypes.string, propTypes.number ]).isRequired
  })),
  fetchPlatforms: propTypes.func.isRequired
};

AddProductsToPortfolio.defaultProps = {
  platforms: []
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AddProductsToPortfolio));
