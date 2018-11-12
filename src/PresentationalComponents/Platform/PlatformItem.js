import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import './platformitem.scss';
import propTypes from 'prop-types';
import CatItemSvg from '../../assets/images/vendor-openshift.svg';
import ImageWithDefault from '../ImageWithDefault';
import { PlatformStore, fetchPlatformItems } from '../../Store/Actions/PlatformActions';
import { hideModal, showModal } from '../../Store/Actions/MainModalActions';
import { GridItem, Card, CardHeader, CardBody, CardFooter } from '@patternfly/react-core';
import { Dropdown, DropdownItem, DropdownPosition, DropdownSeparator, DropdownToggle } from '@patternfly/react-core';
import { Select, SelectOption, SelectOptionGroup } from '@patternfly/react-core';
import { bindMethods, consoleLog } from '../../Helpers/Shared/Helper';

const propLine = (prop, value) => {
    return (<div className = "card_element"> { value } </div>);
};

const toDisplayProperty = property => {
    return [ 'description' ].includes(property);
};

const propDetails = item => {
    let details = [];

    for (let property in item) {
        if (item.hasOwnProperty(property) && toDisplayProperty(property)) {
            if (item[property] && item[property] !== undefined) {
                details.push(propLine(property, item[property].toString()));
            }
        }
    }

    return details;
};

const itemDetails = props => {
    let details = propDetails(props);
    return (
        <React.Fragment>
            <div>{ details }</div>
        </React.Fragment>
    );
};

const mapDispatchToProps = dispatch => {
    return {
        hideModal: () => dispatch(hideModal()),
        showModal: (modalProps, modalType) => {
            dispatch(showModal({ modalProps, modalType }));
        }
    };
};

class PlatformItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = { isOpen: true, showMenu: false };
        bindMethods(this, [ 'onSelect', 'handleMenuOpen', 'handleMenuClose', 'showPortfolioMenu', 'hidePortfolioMenu' ]);
    };

    handleMenuOpen() {
        this.setState({ isOpen: true });
    }

    handleMenuClose() {
        this.setState({ isOpen: false });
    }

    showPortfolioMenu() {
        this.setState({ showMenu: true });
    }

    hidePortfolioMenu() {
        this.setState({ showMenu: false });
    }

    onSelect(event) {
        consoleLog('This is the selected state:', this.state);
        consoleLog('This is the selected event:', event);

        this.props.showModal({
            open: true,
            itemdata: this.props,
            closeModal: this.props.hideModal
        }, 'addportfolio');

        this.setState({
            ...this.state,
            isOpen: !this.state.isOpen
        });
    };

    dropdownPortfolioItems() {
        let dropdownItems = [
            <DropdownItem key="add_portfolio" component="button">
            Add Portfolio
            </DropdownItem> ];

        dropdownItems.push(<DropdownSeparator key="separator"/>);
        this.props.portfolios.map((portfolio) => {
            dropdownItems.push(
                <DropdownItem component="button" key={ portfolio.id }>{ portfolio.name }</DropdownItem>);
        });
        return dropdownItems;
    }

    render() {
        return (
            <GridItem key={ this.props.id } GridItem sm={ 6 } md={ 4 } lg={ 4 } xl={ 3 }>
                <Card onMouseEnter = { this.showPortfolioMenu }
                    onMouseLeave = { this.hidePortfolioMenu }
                >
                    <div className="card_style_with_hover" key={ this.props.id }>
                        <CardHeader className="card_header">
                            <ImageWithDefault src={ this.props.imageUrl || CatItemSvg } defaultSrc={ CatItemSvg } width="50" height="50" />
                        </CardHeader>
                        <CardBody className="card_body" style={{overflowY: 'scroll'}}>
                            { this.state.showMenu &&
                                <div className = "mask flex-center rgba-grey-strong" style={{overflowY: 'visible'}}>
                                    <Dropdown
                                        isOpen={ this.state.isOpen }
                                        className="portfolio_menu"
                                        onToggle={ this.onToggle }
                                        onSelect={ this.onSelect }
                                        position={ DropdownPosition.left }
                                        toggle={ <DropdownToggle onToggle={ this.onToggle } className="portfolio_menu"> Portfolio </DropdownToggle> }
                                        id="dropdown-menu" itemdata={ this.props }
                                    >
                                        { this.dropdownPortfolioItems() }
                                    </Dropdown>
                                </div>
                            }
                            <h4>{ this.props.name }</h4>
                            { itemDetails(this.props) }
                        </CardBody>
                        <CardFooter>
                        </CardFooter>
                    </div>
                </Card>
            </GridItem>
        );
    };
}

function mapStateToProps(state) {
    return {
        portfolios: state.PortfolioStore.portfolios
    };
}

PlatformItem.propTypes = {
    history: propTypes.object,
    showModal: propTypes.func,
    hideModal: propTypes.func,
    imageUrl: propTypes.string,
    portfolios: propTypes.array,
    id: propTypes.string,
    name: propTypes.string
};

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps)(PlatformItem)
);

