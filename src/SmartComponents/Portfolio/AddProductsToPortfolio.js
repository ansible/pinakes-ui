import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import propTypes from 'prop-types';
import { parse } from 'querystring';
import { Main, Section } from '@red-hat-insights/insights-frontend-components';
import { fetchPlatformItems } from '../../Store/Actions/PlatformActions';
import { consoleLog } from '../../Helpers/Shared/Helper';
import { Grid, GridItem, Toolbar, ToolbarGroup, ToolbarItem, ToolbarSection } from '@patternfly/react-core';
import ContentGallery from '../../SmartComponents/ContentGallery/ContentGallery';
import MainModal from '../Common/MainModal';
import PlatformToolbar from '../../PresentationalComponents/Platform/PlatformToolbar';
import '../Platform/platformitems.scss';
import { Stack, StackItem } from '@patternfly/react-core';
import '../../SmartComponents/Portfolio/portfolio.scss';
import EditPortfolioOrderToolbar from '../../PresentationalComponents/Portfolio/EditPortfolioOrderToolbar';
import EditPortfolioTitleToolbar from '../../PresentationalComponents/Portfolio/EditPortfolioTitleToolbar';
import EditPortfolioFilterToolbar from '../../PresentationalComponents/Portfolio/EditPortfolioFilterToolbar';

class AddProductsToPortfolio extends Component {
    state = {
        filteredItems: [],
        selectable: true,
        clickable: false
    };

    fetchData(apiProps) {
        apiProps = { platform: '3' };
        this.props.fetchPlatformItems(apiProps);
    }

    componentDidMount() {
        this.fetchData();
    }

    render() {
        let filteredItems = {
            items: this.props.platformItems.platformItems,
            selectable: true,
            clickable: false,
            isLoading: this.props.isLoading
        };
        return (
            <Main style={ { marginLeft: 0, paddingLeft: 0, paddingTop: 0 } }>
                <div>
                    <Stack>
                        <StackItem> <EditPortfolioOrderToolbar/> </StackItem>
                        <StackItem> <EditPortfolioTitleToolbar/> </StackItem>
                        <StackItem> <EditPortfolioFilterToolbar/> </StackItem>
                    </Stack>
                </div>
                <ContentGallery { ...filteredItems } />
                <MainModal />
            </Main>
        );
    }
}

function mapStateToProps(state, ownProps) {
    return {
        platformItems: state.PlatformStore.platformItems,
        isLoading: state.PlatformStore.isPlatformDataLoading
    };
}

const mapDispatchToProps = dispatch => {
    return {
        fetchPlatformItems: apiProps => dispatch(fetchPlatformItems(apiProps))
    };
};

AddProductsToPortfolio.propTypes = {
    platforms: propTypes.object,
    isLoading: propTypes.bool,
    history: propTypes.object
};

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(AddProductsToPortfolio)
);
