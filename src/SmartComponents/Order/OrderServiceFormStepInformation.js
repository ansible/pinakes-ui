import React from 'react';
import { Form } from 'patternfly-react';
import CatItemSvg from '../../assets/images/vendor-openshift.svg';
import ImageWithDefault from '../../PresentationalComponents/Shared/ImageWithDefault';
import propTypes from 'prop-types';
import { connect } from 'react-redux';

class OrderServiceFormStepInformation extends React.Component {
  state = {
    showOrder: false,
    activeStepIndex: 0,
    stepParametersValid: false
  };

  // deprecated in react
  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
    this.setState({
      stepParametersValid: nextProps.stepParametersValid || false
    });
  }

  render() {
    return (
      <Form horizontal>
        <Form.FormGroup>
          <div>
            <table>
              <tbody>
                <tr>
                  <td><ImageWithDefault src = { this.props.imageUrl || CatItemSvg } defaultSrc={ CatItemSvg } width="100" /></td>
                  <td><h3> { this.props.name } </h3></td>
                </tr>
              </tbody>
            </table>
            <br/>
            <br/>
          </div>
          { this.props.description }
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
  error: propTypes.bool,
  imageUrl: propTypes.string,
  description: propTypes.string,
  name: propTypes.string
};

const mapStateToProps = state => ({ serviceData: state.OrderStore.serviceData });

export default connect(mapStateToProps)(OrderServiceFormStepInformation);
