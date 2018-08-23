import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { PageHeader } from '@red-hat-insights/insights-frontend-components';
import { PageHeaderTitle } from '@red-hat-insights/insights-frontend-components';
import { Section } from '@red-hat-insights/insights-frontend-components';
import { Card } from '@red-hat-insights/insights-frontend-components';

import ContentGallery from 'SmartComponents/ContentGallery/ContentGallery';
import { connect } from 'react-redux';
import { fetchCatalogItemsList } from 'Store/Actions/CatalogItemActions';
import { CatalogItemProperties } from 'PresentationalComponents/CatalogItems/CatalogItemShow';
import propTypes from 'prop-types';
import DEFAULT_PAGE_SIZE from '../../Utilities/Constants';

class CatalogItems extends Component {
    constructor(props) {
        super(props);
        this.state = {
            filteredCatalogItems: [],
        };
    }

    fetchData(apiProps) {
        let defaultProps = {
            catalog_items_list: [this.props.searchFilter],
            page_size: this.props.catalogItemsList.pageSize ? this.props.catalogItemsList.pageSize : DEFAULT_PAGE_SIZE,
            page: this.props.catalogItemsList.page ? this.props.catalogItemsList.page : 1,
            pages: this.props.catalogItemsList.pages ? this.props.catalogItemsList.pages : this.props.catalogItemsList.length % DEFAULT_PAGE_SIZE +1
        };
        this.props.fetchCatalogItems({ ...defaultProps, ...apiProps });
    }

    componentDidMount() {
        this.fetchData();
    }

    render() {
        let catalogItemsList = {
            ...this.props.catalogItemsList,
            isLoading: this.props.isLoading,
            fetchData: apiProps => this.fetchData(apiProps)
        };
        return (
            <div className="pf-l-stack">
                <div className="pf-l-stack__item pf-m-secondary ">
                    <PageHeader>
                        <PageHeaderTitle title="Catalog Items" />
                    </PageHeader>
                </div>

                <Section type="content">
                  <div className="pf-l-stack__item pf-m-secondary ">
                    <ContentGallery {...catalogItemsList} />
                  </div>
                </Section>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        catalogItemsList: {
            items: state.CatalogStore.catalogItems,
            page: state.CatalogStore.page,
            pages: state.CatalogStore.pages,
            page_size: state.CatalogStore.pageSize,
        },
        isLoading: state.CatalogStore.isLoading,
        searchFilter: state.CatalogStore.filterValue
    };
}

const mapDispatchToProps = dispatch => {
    return {
        fetchCatalogItems: apiProps => dispatch(fetchCatalogItemsList(apiProps)),
        search: value => dispatch(searchCatalogItems(value))
    };
};

CatalogItems.propTypes = {
    catalogItemsList: propTypes.object,
    isLoading: propTypes.bool,
    searchFilter: propTypes.string,
    history: propTypes.object,
    fetchCatalogItems: propTypes.func,
    searchCatalogItems: propTypes.func
};

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(CatalogItems)
);
