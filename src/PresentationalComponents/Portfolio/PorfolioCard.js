import React from 'react';
import { withRouter } from 'react-router-dom';
import './portfoliocard.scss';
import propTypes from 'prop-types';
import DefaultPortfolioImg from '../../assets/images/default-portfolio.jpg';
import ImageWithDefault from '../Shared/ImageWithDefault';
import itemDetails from '../Shared/CardCommon';
import { GridItem, Card, CardHeader, CardBody, CardFooter } from '@patternfly/react-core';
import '../../SmartComponents/Portfolio/portfolio.scss';

const TO_DISPLAY = [ 'description', 'modified' ];

class PortfolioCard extends React.Component {
    render() {
        return (
            <GridItem sm={ 6 } md={ 4 } lg={ 4 } xl={ 3 }>
                <Card className="pcard_style">
                    <CardHeader className="pcard_header">
                        <ImageWithDefault src={ this.props.imageUrl || DefaultPortfolioImg } defaultSrc={ DefaultPortfolioImg } />
                    </CardHeader>
                    <CardBody className="pcard_body">
                        <h4>{ this.props.name }</h4>
                        { itemDetails(this.props, TO_DISPLAY) }
                    </CardBody>
                    <CardFooter/>
                </Card>
            </GridItem>
        );
    };
}

PortfolioCard.propTypes = {
    history: propTypes.object,
    imageUrl: propTypes.string,
    name: propTypes.string
};

export default withRouter(PortfolioCard);
