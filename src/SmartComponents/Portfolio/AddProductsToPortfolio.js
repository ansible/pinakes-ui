import React, { Component, cloneElement } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import propTypes from 'prop-types';
import { Section } from '@red-hat-insights/insights-frontend-components';
import { fetchPlatformItems } from '../../Store/Actions/PlatformActions';
import ContentGallery from '../../SmartComponents/ContentGallery/ContentGallery';
import MainModal from '../Common/MainModal';
import '../Platform/platformitems.scss';
import '../../SmartComponents/Portfolio/portfolio.scss';
import PortfolioOrderToolbar from '../../PresentationalComponents/Portfolio/PortfolioOrderToolbar';
import AddProductsTitleToolbar from '../../PresentationalComponents/Portfolio/AddProductsTitleToolbar';
import PlatformDashboard from '../../PresentationalComponents/Platform/PlatformDashboard';
import PlatformSelectToolbar from '../../SmartComponents/Common/PlatformSelectToolbar';
import {addToPortfolio, fetchPortfolios, updatePortfolio} from '../../Store/Actions/PortfolioActions';
import {addAlert, removeAlert} from "../../Store/Actions/AlertActions";

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

    onAddToPortfolio = () => {
        this.props.addToPortfolio(this.props.portfolio.id, this.state.checkedItems).then(() => { this.props.addAlert({
            variant: 'success',
            title: 'Success adding to portfolio',
            description: 'The products were addeds successfully.'
        });
        this.props.resetViewMode(null, true);
        }).catch(() => this.props.addAlert({
            variant: 'danger',
            title: 'Failed adding portfolio',
            description: 'The portfolio was not added successfuly.'
        }));
    };

    render() {
        let filteredItems = [];
        if (this.props.platformItems.platformItems) {
            filteredItems = {
                items: this.props.platformItems.platformItems.map(item =>
                    ({
                        ...cloneElement(item, {
                            editMode: true,
                            id: item.props.id,
                            onToggleSelect: this.onToggleItemSelect,
                            checkedItems: this.state.checkedItems
                        })
                    })
                ),
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

function mapStateToProps(state, ownProps) {
    return {
        platformItems: state.PlatformStore.platformItems,
        isLoading: state.PlatformStore.isPlatformDataLoading
    };
}

const mapDispatchToProps = dispatch => bindActionCreators({
    addAlert,
    removeAlert,
    fetchPlatformItems,
    addToPortfolio
}, dispatch);

AddProductsToPortfolio.propTypes = {
    platformItems: propTypes.array,
    isLoading: propTypes.bool,
    history: propTypes.object,
    isEditMode: propTypes.bool,
    addToPortfolio: propTypes.func,
    resetViewMode: propTypes.func
};

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(AddProductsToPortfolio)
);
