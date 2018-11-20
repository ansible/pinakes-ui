import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import propTypes from 'prop-types';
import { Section, PageHeader, PageHeaderTitle } from '@red-hat-insights/insights-frontend-components';
import { Toolbar, ToolbarGroup, ToolbarItem, ToolbarSection, Title, Button } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import spacingStyles from '@patternfly/patternfly-next/utilities/Spacing/spacing.css';
import flexStyles from '@patternfly/patternfly-next/utilities/Flex/flex.css';
import ContentGallery from '../../SmartComponents/ContentGallery/ContentGallery';
import PortfolioCard from '../../PresentationalComponents/Portfolio/PorfolioCard';
import { fetchPortfolios } from '../../Store/Actions/PortfolioActions';
import MainModal from '../Common/MainModal';

class Portfolios extends Component {
    constructor(props) {
        super(props);
        this.state = {
            filteredItems: []
        };
    }

    fetchData(apiProps) {
        this.props.fetchPortfolios(apiProps);
    }

    componentDidMount() {
        this.fetchData();
    }

    renderToolbar() {
        return (
            <Toolbar className={css(flexStyles.justifyContentSpaceBetween, spacingStyles.mxXl, spacingStyles.myMd)}>
                <ToolbarGroup>
                    <ToolbarItem className={css(spacingStyles.mrXl)}>
                        <Title size={ '2xl '}> All Portfolios</Title>
                    </ToolbarItem>
                </ToolbarGroup>
                <ToolbarGroup  className={ 'pf-u-ml-auto-on-xl' }>
                    <ToolbarItem>
                        <Button variant="primary" aria-label="Create Portfolio">
                            Create Portfolio
                        </Button>
                    </ToolbarItem>
                </ToolbarGroup>
            </Toolbar>
        );
    }

    render() {
        let portfolios = [];
        this.props.portfolios.forEach(function(item, row, _array) {
            let newRow = <PortfolioCard { ...item } />;
            portfolios.push(newRow);
        });

        let filteredItems = {
            items: portfolios,
            isLoading: this.props.isLoading
        };

        return (
            <Section>
                <div style={ { marginTop: '15px', marginLeft: '25px', marginRight: '25px' } }>
                    { this.renderToolbar() }
                </div>
                <ContentGallery { ...filteredItems } />
                <MainModal />
            </Section>
        );
    }
}

function mapStateToProps(state) {
    return {
        portfolios: state.PortfolioStore.portfolios,
        isLoading: state.PortfolioStore.isLoading,
        searchFilter: state.PortfolioStore.filterValue
    };
}

const mapDispatchToProps = dispatch => {
    return {
        fetchPortfolios: apiProps => dispatch(fetchPortfolios(apiProps))
    };
};

Portfolios.propTypes = {
    filteredItems: propTypes.object,
    isLoading: propTypes.bool,
    searchFilter: propTypes.string,
    history: propTypes.object
};

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(Portfolios)
);
