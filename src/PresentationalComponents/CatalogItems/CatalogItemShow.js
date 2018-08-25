import { withRouter } from 'react-router-dom';
import './catalogitemshow.scss';
import React from 'react';
import propTypes from 'prop-types';
import CatItemSvg from '../../assets/images/vendor-openshift.svg';
import ImageWithDefault from '../ImageWithDefault';
import OrderServiceForm from '../../SmartComponents/Order/OrderServiceForm';
import { showServiceOrderWizard, hideServiceOrderWizard} from "../../Store/Actions/OrderActions";
import { OrderStore } from "../../Store/Actions/OrderActions";


const propLine = (prop, value) => {
    return(<div key = {prop} className = "card_element">  {prop} : {value} </div>);
};

const defaultProperty = property => {
    return ['match', 'location', 'history', 'imageUrl', 'provider_id'].includes(property)
}

const propDetails = item => {
    let details = [];

    for (let property in item) {
        if (item.hasOwnProperty(property) && !defaultProperty(property)) {
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

class CatalogItemShow extends React.Component {
  constructor(props) {
    super(props);
    this.handleOnClick = this.handleOnClick.bind(this);
    this.state = { showOrder:false };
  };

  handleOnClick(props) {
    console.log( 'Before OrderService');
    this.setState({ showOrder: true })
    // props.history.push('/catalog/catalogitems/'.concat(props.catalog_id));
  };

  render() {
    return (
        <React.Fragment>
          <div className="pf-l-grid__item pf-m-2-col pf-m-6-row">
            <OrderServiceForm key = 'OrderServiceForm' showOrder={this.state.showOrder} servicedata = {this.props} />
            <div className="card_style"  onClick={ () => {this.handleOnClick(this.props)}}>
              <div className="card_header">
                <ImageWithDefault src={this.props.imageUrl || CatItemSvg} defaultSrc={CatItemSvg} width="80" height="80" />
              </div>
              <div className="card_body">
                {itemDetails(this.props)}
              </div>
              <br/>
              <div className="bottom-48">
                {this.props.name}
              </div>
              <div className="bottom-24">
                Approval Required
              </div>
            </div>
          </div>
        </React.Fragment>
    );
  };
}

CatalogItemShow.propTypes = {
    history: propTypes.object,
    catalog_id: propTypes.string
};

export default withRouter(CatalogItemShow);

