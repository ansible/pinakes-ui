import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import './portfoliocard.scss';
import propTypes from 'prop-types';
import DefaultPortfolioImg from '../../assets/images/default-portfolio.jpg';
import ImageWithDefault from '../ImageWithDefault';
import { PortfolioStore } from '../../Store/Actions/PortfolioActions';
import { hideModal, showModal } from '../../Store/Actions/MainModalActions';
import { GridItem, Card, CardHeader, CardBody, CardFooter } from '@patternfly/react-core';
import { bindMethods, consoleLog } from '../../Helpers/Shared/Helper';

const propLine = (prop, value) => {
    return (<div className = "card_element"> { value } </div>);
};

const toDisplayProperty = property => {
    return [ 'description', 'modified' ].includes(property);
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

class PortfolioCard extends React.Component {
    constructor(props) {
        super(props);
        this.handleOnClick = this.handleOnClick.bind(this);
    };

    handleOnClick() {
        consoleLog('Before OrderService');
    };

    render() {
        return (
            <GridItem GridItem sm={ 6 } md={ 4 } lg={ 4 } xl={ 3 }>
                <Card  className="pcard_style">
                    <CardHeader className="pcard_header">
                        <ImageWithDefault src={ this.props.imageUrl || DefaultPortfolioImg } defaultSrc={ DefaultPortfolioImg } />
                    </CardHeader>
                    <CardBody className="pcard_body">
                        <h4>{ this.props.name }</h4>
                        { itemDetails(this.props) }
                    </CardBody>
                    <CardFooter/>
                </Card>
            </GridItem>
        );
    };
}

PortfolioCard.propTypes = {
    history: propTypes.object,
    showModal: propTypes.func,
    hideModal: propTypes.func,
    imageUrl: propTypes.string,
    name: propTypes.string
};

export default withRouter(
    connect(
        null,
        mapDispatchToProps)(PortfolioCard)
);
