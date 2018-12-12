import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import './portfolioitem.scss';
import propTypes from 'prop-types';
import CatItemSvg from '../../assets/images/vendor-openshift.svg';
import ImageWithDefault from '../../PresentationalComponents/Shared/ImageWithDefault';
import itemDetails from '../../PresentationalComponents/Shared/CardCommon';
import { hideModal, showModal } from '../../redux/Actions/MainModalActions';
import { GridItem, Card, CardHeader, CardBody, CardFooter } from '@patternfly/react-core';

const TO_DISPLAY = [ 'description' ];

const mapDispatchToProps = dispatch => ({
  hideModal: () => dispatch(hideModal()),
  showModal: (modalProps, modalType) => dispatch(showModal({ modalProps, modalType }))
});

class PortfolioItem extends React.Component {

    handleOnClick = () => {
      this.setState({ showOrder: true });
      this.props.showModal({
        open: true,
        servicedata: this.props,
        closeModal: this.props.hideModal
      }, 'order');
    };

    render() {
      return (
        <GridItem sm={ 6 } md={ 4 } lg={ 4 } xl={ 3 }>
          <Card>
            <div onClick={ () => {this.handleOnClick(this.props);} }>
              <CardHeader className="card_header">
                <ImageWithDefault src={ this.props.imageUrl || CatItemSvg } defaultSrc={ CatItemSvg } width="50" height="50" />
              </CardHeader>
              <CardBody className="card_body">
                <h4>{ this.props.name }</h4>
                { itemDetails(this.props, TO_DISPLAY) }
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
  showModal: propTypes.func,
  hideModal: propTypes.func,
  imageUrl: propTypes.string,
  name: propTypes.string
};

export default withRouter(connect(null, mapDispatchToProps)(PortfolioItem));
