import React from 'react';
import { Form, Radio } from 'patternfly-react';

class OrderServiceFormStepBind extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Form horizontal>
        <h3 className="right-aligned_basic-form">Bind</h3>
        <Form.FormGroup>
        </Form.FormGroup>
      </Form>
    );
  }
}

export default OrderServiceFormStepBind;