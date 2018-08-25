import React from 'react';
import { Form, Radio } from 'patternfly-react';
import CatItemSvg from '../../assets/images/vendor-openshift.svg';
import ImageWithDefault from '../../PresentationalComponents/ImageWithDefault';

class OrderServiceFormStepResult extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Form horizontal>
        <h3 className="right-aligned_basic-form">Results</h3>
        <Form.FormGroup>
        </Form.FormGroup>
      </Form>
    );
  }
}

export default OrderServiceFormStepResult;