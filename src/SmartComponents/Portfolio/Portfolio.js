import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import propTypes from 'prop-types';
import { Section, PageHeader, PageHeaderTitle } from '@red-hat-insights/insights-frontend-components';
import { Toolbar, ToolbarGroup, ToolbarItem, ToolbarSection, Dropdown, DropdownPosition,
    DropdownToggle, DropdownItem, KebabToggle, Title, Button } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import spacingStyles from '@patternfly/patternfly-next/utilities/Spacing/spacing.css';
import flexStyles from '@patternfly/patternfly-next/utilities/Flex/flex.css';
import ContentGallery from '../../SmartComponents/ContentGallery/ContentGallery';
import { fetchSelectedPortfolio, fetchPortfolioItemsWithPortfolio } from '../../Store/Actions/PortfolioActions';
import { consoleLog } from '../../Helpers/Shared/Helper';
import MainModal from '../Common/MainModal';
import { hideModal, showModal } from '../../Store/Actions/MainModalActions';
import './portfolio.scss';

class Portfolio extends Component {
    constructor(props) {
        super(props);
        this.state = {
            portfolioId: '',
            isKebabOpen: false,
            isOpen: false
        };
        this.onClickEditPortfolio = this.onClickEditPortfolio.bind(this);
        consoleLog('Portfolio props: ', props);
    }

    fetchData(apiProps) {
        this.props.fetchSelectedPortfolio(apiProps);
        this.props.fetchPortfolioItemsWithPortfolio(apiProps);
    }

    componentDidMount() {
        let portfolioId = this.props.computedMatch.params.id;
        consoleLog('Portfolio Id: ', portfolioId);
        this.fetchData(portfolioId);
    }

    onKebabToggle = isOpen => {
        this.setState({
            isKebabOpen: isOpen
        });
    };

    buildPortfolioActionKebab = () => {
        const { isKebabOpen } = this.state;

        return (
            <Dropdown
                onToggle= { this.onKebabToggle }
                onSelect= { this.onKebabSelect }
                position = { DropdownPosition.right }
                toggle={ <KebabToggle onToggle={ this.onKebabToggle } /> }
                isOpen={ isKebabOpen }
                isPlain
            >
                <DropdownItem component="button">Add Products</DropdownItem>
                <DropdownItem component="button">Remove Products</DropdownItem>
            </Dropdown>
        );
    };

    portfolioActionsToolbar() {
        return (
            <Toolbar className={ css(flexStyles.justifyContentSpaceBetween, spacingStyles.mxXl, spacingStyles.myMd) }>
                <ToolbarGroup>
                    <ToolbarItem className={ css(spacingStyles.mrXl) }>
                        { this.props.portfolio && <Title size={ '2xl' }> { this.props.portfolio.name }</Title> }
                    </ToolbarItem>
                </ToolbarGroup>
                <ToolbarGroup  className={ 'pf-u-ml-auto-on-xl' }>
                    <ToolbarItem className={ css(spacingStyles.mxLg) }>
                        <Button variant="plain" onClick={ () => { this.onClickEditPortfolio(this.props); } } aria-label="Edit Portfolio">
                            Edit Portfolio
                        </Button>
                    </ToolbarItem>
                    <ToolbarItem className={ css(spacingStyles.mxLg) }>
                        <Button variant="plain" aria-label="Remove Portfolio">
                            Remove Portfolio
                        </Button>
                    </ToolbarItem>
                    <ToolbarItem>
                        { this.buildPortfolioActionKebab() }
                    </ToolbarItem>
                </ToolbarGroup>
            </Toolbar>
        );
    }

    onClickEditPortfolio(event) {
        this.props.showModal({
            open: true,
            itemdata: this.props,
            closeModal: this.props.hideModal
        }, 'editportfolio');

        this.setState({
            ...this.state,
            isOpen: !this.state.isOpen
        });
    };

    render() {
        let filteredItems = {
            items: this.props.portfolioItems.portfolioItems,
            isLoading: this.props.isLoading
        };
        return (
            <Section>
                <div className="action-toolbar">
                    { this.portfolioActionsToolbar() }
                </div>
                <ContentGallery { ...filteredItems } />
                <MainModal />
            </Section>
        );
    }
}

function mapStateToProps(state) {
    return {
        portfolio: state.PortfolioStore.selectedPortfolio,
        portfolioItems: state.PortfolioStore.portfolioItems,
        isLoading: state.PortfolioStore.isLoading
    };
}

const mapDispatchToProps = dispatch => {
    return {
        fetchPortfolioItemsWithPortfolio: apiProps => dispatch(fetchPortfolioItemsWithPortfolio(apiProps)),
        fetchSelectedPortfolio: apiProps => dispatch(fetchSelectedPortfolio(apiProps)),
        hideModal: () => dispatch(hideModal()),
        showModal: (modalProps, modalType) => {
            dispatch(showModal({ modalProps, modalType }));
        }
    };
};

Portfolio.propTypes = {
    isLoading: propTypes.bool,
    fetchPortfolioItemsWithPortfolio: propTypes.func,
    fetchSelectedPortfolio: propTypes.func,
    showModal: propTypes.func,
    hideModal: propTypes.func,
    history: propTypes.object
};

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(Portfolio)
);
