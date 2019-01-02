import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import propTypes from 'prop-types';
import { Section } from '@red-hat-insights/insights-frontend-components';
import { addNotification } from '@red-hat-insights/insights-frontend-components/components/Notifications';
import { fetchPlatformItems } from '../../redux/Actions/PlatformActions';
import ContentGallery from '../../SmartComponents/ContentGallery/ContentGallery';
import MainModal from '../Common/MainModal';
import '../Platform/platformitems.scss';
import '../../SmartComponents/Portfolio/portfolio.scss';
import PortfolioOrderToolbar from '../../PresentationalComponents/Portfolio/PortfolioOrderToolbar';
import AddProductsTitleToolbar from '../../PresentationalComponents/Portfolio/AddProductsTitleToolbar';
import PlatformDashboard from '../../PresentationalComponents/Platform/PlatformDashboard';
import PlatformSelectToolbar from '../../SmartComponents/Common/PlatformSelectToolbar';
import { addToPortfolio } from '../../redux/Actions/PortfolioActions';
import PlatformItem from '../../PresentationalComponents/Platform/PlatformItem';

class AddProductsToPortfolio extends Component {
    state = {
      selectedPlatforms: [],
      checkedItems: []
    };

    async fetchData(platforms) {
      await this.props.fetchPlatformItems(platforms);
    }

    onPlatformSelectionChange = (selectedValues) => {
      this.setState({ selectedPlatforms: selectedValues });
      this.fetchData({ platform: selectedValues[0].id });
    };

    onToggleItemSelect = (event) => {
      const item = event.target.id;
      const isChecked = event.target.checked;
      console.log('item select: ', event);
      if (isChecked) {
        this.setState(state => {
          const checkedItems = [ ...state.checkedItems, item ];
          return {
            checkedItems
          };
        });
      }
      else {
        this.setState(prevState => ({ checkedItems: prevState.checkedItems.filter((value) => { return !(value === item.id);}) }));
      }
    };

    onAddToPortfolio = () =>
      this.props.addToPortfolio(this.props.portfolio.id, this.state.checkedItems)
      .then(() => this.props.resetViewMode(null, true));

    render() {
      let filteredItems = [];
      if (this.props.platformItems) {
        filteredItems = {
          items: this.props.platformItems.map(item => (
            <PlatformItem
              key={ item.id }
              { ...item }
              editMode
              onToggleItemSelect={ this.onToggleItemSelect }
              checkedItems={ this.state.checkedItems }
            />)),
          isLoading: this.props.isLoading
        };
      }

      let title = (this.props.portfolio) ? this.props.portfolio.name : '';
      return (
        <Section>
          <PortfolioOrderToolbar/>
          <AddProductsTitleToolbar title={ title }
            onClickAddToPortfolio = { this.onAddToPortfolio }
            onClickCancelAddProducts={ this.props.resetViewMode }/>
          <PlatformSelectToolbar onOptionSelect={ this.onPlatformSelectionChange } { ...this.props } />
          { (this.state.selectedPlatforms.length > 0) &&
                    this.state.selectedPlatforms.map((platform)=> {return (<ContentGallery key={ platform.id } { ...filteredItems }
                      title={ platform.name }
                      editMode = { true }
                      onToggleSelect = { this.onToggleItemSelect }
                      checkedItems = { this.state.checkedItems }
                    />);}) }
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
  fetchPlatformItems,
  addToPortfolio
}, dispatch);

AddProductsToPortfolio.propTypes = {
  platformItems: propTypes.array,
  isLoading: propTypes.bool,
  isEditMode: propTypes.bool,
  addToPortfolio: propTypes.func,
  resetViewMode: propTypes.func,
  fetchPlatformItems: propTypes.func,
  portfolio: propTypes.shape({
    name: propTypes.string,
    id: propTypes.oneOfType([ propTypes.string, propTypes.number ]).isRequired
  }).isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(AddProductsToPortfolio);
