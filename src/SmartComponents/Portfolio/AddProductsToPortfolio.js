import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import propTypes from 'prop-types';
import { Section } from '@red-hat-insights/insights-frontend-components';
import { addNotification } from '@red-hat-insights/insights-frontend-components/components/Notifications';
import { fetchMultiplePlatformItems } from '../../redux/Actions/PlatformActions';
import ContentGallery from '../../SmartComponents/ContentGallery/ContentGallery';
import MainModal from '../Common/MainModal';
import '../Platform/platform.scss';
import '../../SmartComponents/Portfolio/portfolio.scss';
import PortfolioOrderToolbar from '../../PresentationalComponents/Portfolio/PortfolioOrderToolbar';
import AddProductsTitleToolbar from '../../PresentationalComponents/Portfolio/AddProductsTitleToolbar';
import PlatformDashboard from '../../PresentationalComponents/Platform/PlatformDashboard';
import PlatformSelectToolbar from '../../SmartComponents/Common/PlatformSelectToolbar';
import { addToPortfolio, fetchPortfolioItemsWithPortfolio } from '../../redux/Actions/PortfolioActions';
import PlatformItem from '../../PresentationalComponents/Platform/PlatformItem';

class AddProductsToPortfolio extends Component {
    state = {
      selectedPlatforms: [],
      checkedItems: [],
      searchValue: ''
    };

    handleFilterChange = searchValue => this.setState({ searchValue })

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
      .then(() => this.props.fetchPortfolioItemsWithPortfolio(this.props.match.params.id));

    createItems = () => {
      const { selectedPlatforms } = this.state;
      const { platformItems } = this.props;
      return selectedPlatforms.map(({ id }) => platformItems[id]
        ? platformItems[id].filter(({ name }) => name.trim().toLowerCase().includes(this.state.searchValue.toLocaleLowerCase())).map(item =>
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
          isLoading: this.props.isLoading
        };
      }

      let title = (this.props.portfolio) ? this.props.portfolio.name : '';
      return (
        <Section>
          <PortfolioOrderToolbar/>
          <AddProductsTitleToolbar title={ title }
            onClickAddToPortfolio = { this.onAddToPortfolio }
            portfolioRoute={ this.props.portfolioRoute }
          />
          <PlatformSelectToolbar
            searchValue={ this.state.searchValue }
            onFilterChange={ this.handleFilterChange }
            onOptionSelect={ this.onPlatformSelectionChange }
            { ...this.props }
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
          <MainModal/>
        </Section>
      );
    }
}

const mapStateToProps = ({ platformReducer: { platformItems, isPlatformDataLoading }}) => ({
  platformItems,
  isLoading: isPlatformDataLoading
});

const mapDispatchToProps = dispatch => bindActionCreators({
  addNotification,
  fetchMultiplePlatformItems,
  addToPortfolio,
  fetchPortfolioItemsWithPortfolio
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
  match: propTypes.shape({
    params: propTypes.shape({
      id: propTypes.string.isRequired
    }).isRequired
  }).isRequired,
  portfolioRoute: propTypes.string.isRequired,
  fetchPortfolioItemsWithPortfolio: propTypes.func.isRequired
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AddProductsToPortfolio));
