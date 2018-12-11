import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import propTypes from 'prop-types';
import { Input, Section } from '@red-hat-insights/insights-frontend-components';
import ContentGallery from '../../SmartComponents/ContentGallery/ContentGallery';
import PlatformItems from '../../SmartComponents/Platform/PlatformItems';
import MainModal from '../Common/MainModal';
import '../Platform/platformitems.scss';
import '../../SmartComponents/Portfolio/portfolio.scss';
import PortfolioOrderToolbar from '../../PresentationalComponents/Portfolio/PortfolioOrderToolbar';
import AddProductsTitleToolbar from '../../PresentationalComponents/Portfolio/AddProductsTitleToolbar';
import PlatformDashboard from '../../PresentationalComponents/Platform/PlatformDashboard';
import { Toolbar, ToolbarGroup, ToolbarItem, Button, ButtonVariant,
    Dropdown, DropdownItem, DropdownToggle } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';

class AddProductsToPortfolio extends Component
{
    state = {
        isOpen: false,
        selected: [],
        clickable: false,
        selectedPlatforms: [],
        searchValue: ''
    };
    onToggle = () => { this.setState(prevState => ({ isOpen: !prevState.isOpen }));};

    onSelect = (event) => {
        const { platforms } = this.props;
        this.setState({
            isOpen: false,
            selected: platforms.find(oneItem => oneItem.value === event.target.getAttribute('data-key'))
        });
        this.props.onOptionSelect && this.props.onOptionSelect(event);
    }

    onSearchSubmit = () => {
        this.props.hasOwnProperty('onSearchClick') && this.props.onSearchClick(this.state.searchValue, this.state.selected);
    };

    renderToolbar = () => {
        const {
            platforms,
            ...props
        } = this.props;
        const placeholder = 'Find a product';
        const { isOpen, selected } = this.state;
        const dropdownItems = platforms.map(platform =>
            <DropdownItem key={ platform.id } data-key={ platform.id }>{ platform.name }</DropdownItem>
        );
        return (
            <Toolbar style={ { backgroundColor: '#FFFFFF' } }>
                <ToolbarGroup className={ 'pf-u-ml-on-md' }>
                    <ToolbarItem className={ 'pf-u-ml-sm pf-u-my-sm' }>
                        <div className="pf-c-input-group">
                            <Input placeholder={ placeholder } onChange={ this.onInputChange }
                                aria-label="Find product button"></Input>
                            <Button variant="tertiary" id="searchProductButton" onClick={ this.onSearchSubmit }>
                                <i className="fas fa-search" aria-hidden="true"></i>
                            </Button>
                        </div>
                    </ToolbarItem>
                    <ToolbarItem className={ 'pf-u-ml-sm pf-u-my-sm' }>
                        { platforms &&
                        <Dropdown
                            onSelect={ this.onSelect }
                            isOpen={ isOpen }
                            toggle={
                                <DropdownToggle onToggle={ this.onToggle }>
                                    { (selected && selected.name) || platforms.name || 'Filter by Platform' }
                                </DropdownToggle>
                            }
                            dropdownItems={ dropdownItems }
                        /> }
                    </ToolbarItem>
                </ToolbarGroup>
            </Toolbar>);
    };

    fetchData(apiProps) {
      this.props.fetchPlatformItems(apiProps);
    }

    render() {
        let filteredItems = {
            items: this.props.platformItems,
            selectedPlatforms: this.state.selectedPlatforms,
            selectable: true,
            clickable: false,
            isLoading: this.props.isLoading
        };
        return (
            <Section >
                <PortfolioOrderToolbar/>
                <AddProductsTitleToolbar />
                { this.renderToolbar() }
                { (this.state.selectedPlatforms.length > 0) &&  <ContentGallery { ...filteredItems } />}
                { (this.state.selectedPlatforms.length < 1) && <PlatformDashboard/> }
                <MainModal />
            </Section>
        );
    }
}

function mapStateToProps(state) {
    return {
        platformItems: state.PlatformStore.platformItems,
        platforms: state.PlatformStore.platforms,
        isLoading: state.PlatformStore.isPlatformDataLoading
    };
}

const mapDispatchToProps = dispatch => {
    return {
        fetchPlatformItems: apiProps => dispatch(fetchPlatformItems(apiProps))
    };
};

AddProductsToPortfolio.propTypes = {
    platformItems: propTypes.array,
    platforms: propTypes.array,
    isLoading: propTypes.bool,
    history: propTypes.object
};

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(AddProductsToPortfolio)
);
