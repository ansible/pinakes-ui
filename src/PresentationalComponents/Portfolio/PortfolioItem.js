import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import './portfolioitem.scss';
import propTypes from 'prop-types';
import CatItemSvg from '../../assets/images/vendor-openshift.svg';
import ImageWithDefault from '../ImageWithDefault';
import { PortfolioStore } from "../../Store/Actions/PortfolioActions";
import { hideModal, showModal } from "../../Store/Actions/MainModalActions";
import { GridItem, Card, CardHeader, CardBody, CardFooter } from '@patternfly/react-core';
import {bindMethods} from "../../Helpers/Shared/Helper";


const propLine = (prop, value) => {
    return(<div className = "card_element"> {value} </div>);
};

const toDisplayProperty = property => {
    return ['description'].includes(property)
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
            <div>{details}</div>
        </React.Fragment>
    );
};

const mapDispatchToProps = dispatch => {
    return {
        hideModal: () => dispatch(hideModal()),
        showModal: (modalProps, modalType) => {
            dispatch(showModal({ modalProps, modalType }))
        }
    };
};


class PortfolioItem extends React.Component {
    constructor(props) {
        super(props);
        this.handleOnClick = this.handleOnClick.bind(this);
    };

    handleOnClick() {
        console.log( 'Before OrderService');
        this.setState({ showOrder: true });
        this.props.showModal({
            open: true,
            servicedata: this.props,
            closeModal: this.props.hideModal
        }, 'order');
    };

    render() {
        return (
            <GridItem GridItem sm={6} md={4} lg={4} xl={3}>
                <Card>
                    <div onClick={ () => {this.handleOnClick(this.props)}}>
                        <CardHeader className="card_header">
                            <ImageWithDefault src={this.props.imageUrl || CatItemSvg} defaultSrc={CatItemSvg} width="50" height="50" />
                        </CardHeader>
                        <CardBody className="card_body">
                            <h4>{this.props.name}</h4>
                            {itemDetails(this.props)}
                        </CardBody>
                        <CardFooter>
                        </CardFooter>
                    </div>
                </Card>
            </GridItem>
        );
    };
}

PortfolioItem.propTypes = {
    history: propTypes.object,
    catalog_id: propTypes.string
};

export default withRouter(
    connect(
        null,
        mapDispatchToProps)(PortfolioItem)
);

