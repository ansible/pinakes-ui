import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import './portfolioitem.scss';
import propTypes from 'prop-types';
import CatItemSvg from '../../assets/images/vendor-openshift.svg';
import ImageWithDefault from '../../PresentationalComponents/Shared/ImageWithDefault';
import { hideModal, showModal } from '../../redux/Actions/MainModalActions';
import { GridItem, Card, CardHeader, CardFooter } from '@patternfly/react-core';
import CardCheckbox from '../../SmartComponents/Common/CardCheckbox';
import ServiceOfferingCardBody from '../../PresentationalComponents/Shared/service-offering-body';

const mapDispatchToProps = dispatch => bindActionCreators({
  hideModal,
  showModal
}, dispatch);

class PortfolioItem extends Component {
  handleOnClick = () => {
    this.setState({ showOrder: true });
    this.props.showModal({
      modalProps: {
        open: true,
        servicedata: this.props,
        closeModal: this.props.hideModal
      },
      modalType: 'order'
    });
  };

  render() {
    return (
      <GridItem sm={ 6 } md={ 4 } lg={ 4 } xl={ 3 }>
        <Card>
          <div onClick={ () => this.handleOnClick(this.props) }>
            <CardHeader className="card_header">
              { this.props.isSelectable && <CardCheckbox
                handleCheck={ () => { this.props.onSelect(this.props.id); } }
                isChecked={ this.props.isSelected }
                id={ this.props.id } />
              }
              <ImageWithDefault src={ this.props.imageUrl || CatItemSvg } width="30" height="20" />
            </CardHeader>
            <ServiceOfferingCardBody { ...this.props }/>
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
  name: propTypes.string,
  id: propTypes.string,
  isSelectable: propTypes.bool,
  isSelected: propTypes.bool,
  onSelect: propTypes.func
};

export default connect(null, mapDispatchToProps)(PortfolioItem);
