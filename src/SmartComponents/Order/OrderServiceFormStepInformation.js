import React from 'react';
import { Form, Radio } from 'patternfly-react';
import CatItemSvg from '../../assets/images/vendor-openshift.svg';
import ImageWithDefault from '../../PresentationalComponents/ImageWithDefault';
import propTypes from 'prop-types';
import { connect } from 'react-redux';
import {bindMethods} from "../../Helpers/Order/OrderHelper";

class OrderServiceFormStepInformation extends React.Component {
  constructor(props) {
    super(props);
    this.initialState = {
      showOrder: false,
      activeStepIndex: 0,
      stepParametersValid: false
    };

    this.state = { ...this.initialState };
  }

  componentDidMount() {
    console.log('Component did mount - data:');
    console.log(this.props.serviceData)
  }

  componentWillReceiveProps(nextProps) {
     console.log(nextProps);
     this.setState({
      stepParametersValid: nextProps.stepParametersValid || false,
    });
  }

  render() {
    return (
      <Form horizontal>
        <h3 className="right-aligned_basic-form">Information</h3>
        <Form.FormGroup>
          <div className="pf-c-card ">
            <div className="pf-c-card__header ">
              <h6 className="pf-c-title pf-m-xl pf-m-margin">
                <ImageWithDefault src = {this.props.servicedata.imageUrl || CatItemSvg} defaultSrc={CatItemSvg} width="120" height="120"  />
              </h6>
            </div>
            <div className="pf-c-card__body ">
              <table className="content-gallery">
                <tbody>
                <tr>
                  <td>Name:  </td>
                  <td>{this.props.servicedata.name}</td>
                </tr>
                <tr>
                  <td>Description:  </td>
                  <td>{this.props.servicedata.description}</td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </Form.FormGroup>
      </Form>
    );
  }
}



OrderServiceFormStepInformation.propTypes = {
  orderData: propTypes.func,
  showOrder: propTypes.bool,
  serviceData: propTypes.object,
  stepParametersValid: propTypes.bool,
  fulfilled: propTypes.bool,
  error: propTypes.bool
};


function mapStateToProps(state) {
  return { serviceData: state.OrderStore.serviceData };
}

export default connect(mapStateToProps)(OrderServiceFormStepInformation);
