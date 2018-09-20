import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import './catalogitemshow.scss';
import React from 'react';
import propTypes from 'prop-types';
import CatItemSvg from '../../assets/images/vendor-openshift.svg';
import ImageWithDefault from '../ImageWithDefault';
import { OrderStore, showServiceOrderWizard, hideServiceOrderWizard } from "../../Store/Actions/OrderActions";
import { hideModal, showModal } from "../../Store/Actions/MainModalActions";
import { GridItem } from '@patternfly/react-core'


const propLine = (prop, value) => {
    return(<div key = {prop} className = "card_element"> {value} </div>);
};

const defaultProperty = property => {
    return ['match', 'location', 'history', 'imageUrl', 'provider_id', 'hideModal', 'showModal'].includes(property)
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


class CatalogItemShow extends React.Component {
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
    // props.history.push('/catalog/catalogitems/'.concat(props.catalog_id));
  };

  render() {
    return (
      <GridItem sm={2} md={2} lg={2} xl={2}>
        <div className="card_style"  onClick={ () => {this.handleOnClick(this.props)}}>
          <div className="card_header">
            <ImageWithDefault src={this.props.imageUrl || CatItemSvg} defaultSrc={CatItemSvg} width="50" height="50" />
          </div>
          <div className="card_body">
            <h4>{this.props.name}</h4>
            {itemDetails(this.props)}
          </div>
          <div className="bottom-48">
          </div>
        </div>
      </GridItem>
    );
  };
}

CatalogItemShow.propTypes = {
  history: propTypes.object,
  catalog_id: propTypes.string
};

export default withRouter(
    connect(
        null,
        mapDispatchToProps)(CatalogItemShow)
);

