import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import propTypes from 'prop-types';
import { PageHeader, PageHeaderTitle, Main } from '@red-hat-insights/insights-frontend-components';
import ContentGallery from 'SmartComponents/ContentGallery/ContentGallery';
import MainModal from '../Common/MainModal';
import { fetchPortfolioItemsList, searchPortfolioItems } from 'Store/Actions/PortfolioActions';

class AdminDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            filteredPortfolioItems: []
        };
    }

    fetchData(apiProps) {
        let defaultProps = {
            portfolioItems: [this.props.searchFilter],
        };
        this.props.fetchPortfolioItems({ ...defaultProps, ...apiProps });
    }

    componentDidMount() {
        this.fetchData();
    }

    render() {
        let portfolioItems = {
            ...this.props.portfolioItems,
            isLoading: this.props.isLoading
        };
        return (
            <Main>
                <div className="pf-l-stack">
                    <div className="pf-l-stack__item pf-m-secondary ">
                        <PageHeader>
                            <PageHeaderTitle title="Services" />
                        </PageHeader>
                    </div>

                    <div>
                        <div className="pf-l-stack__item pf-m-secondary ">
                            <ContentGallery {...portfolioItems} />
                        </div>
                    </div>
                    <MainModal />
                </div>
            </Main>
        );
    }
}

function mapStateToProps(state) {
    return {
        portfolioItems: {
            items: state.PortfolioStore.portfolioItems,
        },
        isLoading: state.PortfolioStore.isLoading,
        searchFilter: state.PortfolioStore.filterValue
    };
}

const mapDispatchToProps = dispatch => {
    return {
        fetchPortfolioItems: apiProps => dispatch(fetchPortfolioItemsList(apiProps)),
        search: value => dispatch(searchPortfolioItems(value))
    };
};

AdminDashboard.propTypes = {
    portfolioItems: propTypes.object,
    isLoading: propTypes.bool,
    searchFilter: propTypes.string,
    history: propTypes.object,
    fetchPortfolioItems: propTypes.func,
    searchPortfolioItems: propTypes.func
};

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(AdminDashboard)
);
