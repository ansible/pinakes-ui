import React from 'react';
import propTypes from 'prop-types';
import { connect } from 'react-redux';
import { Bullseye, Radio, Form, Title, Stack, StackItem } from '@patternfly/react-core';
import '../../Utilities/jschema.scss';
import { fetchServicePlans, sendSubmitOrder } from '../../redux/Actions/OrderActions';
import FormRenderer from '../Common/FormRenderer';

class OrderServiceFormStepConfiguration extends React.Component {
  state = {
    showOrder: false,
    selectedPlanIdx: 0
  };

  optionRow = (plan, option, selectedId, onChange) =>
    <Radio id={ plan.id }
      key={ plan.id }
      value={ plan.id }
      checked={ selectedId === plan.id }
      name={ plan.name }
      aria-label={ plan.description }
      onChange={ onChange }
      label={ plan.description } />;

  componentDidMount() {
    const { id } = this.props;
    this.props.fetchPlans(id);
  }

  handlePlanChange = (arg, event) =>  {
    const planId = event.currentTarget.value;
    this.setState({ selectedPlanIdx: this.props.servicePlans.findIndex(plan=> plan.id === planId) });
  };

  planOptions = () => {
    let selectedId = this.props.servicePlans[this.state.selectedPlanIdx].id;
    let onChange = this.handlePlanChange;

    return this.props.servicePlans.map((plan, option) => this.optionRow(plan, option, selectedId, onChange));
  }

  onSubmit = (data) => {
    const portfolioItemId = this.props.id;
    const service_plan_id = this.props.servicePlans[this.state.selectedPlanIdx].id;
    this.props.sendSubmitOrder({ portfolio_item_id: portfolioItemId, service_plan_ref: service_plan_id, service_parameters: data });
    this.props.hideModal();
  };

  render() {
    console.log('service plan', this.props);
    if (!this.props.isLoading) {
      return (
        <React.Fragment>
          <Stack gutter={ 'md' } className="order_card">
            <StackItem>
              <Title size={ 'lg' } > Configuration </Title>
            </StackItem>
            <StackItem>
              <Form>
                { (this.props.servicePlans.length > 1) &&
                        <div>
                          <Title size={ 'md' }>Select Plan:</Title>
                          <div>{ this.planOptions() }</div>
                        </div>
                }
                { (!this.props.isLoading && this.props.servicePlans.length > 0) &&
                  <FormRenderer
                    schema={ this.props.servicePlans[this.state.selectedPlanIdx].create_json_schema }
                    onSubmit={ this.onSubmit }
                    schemaType="mozilla"
                  />
                }
              </Form>
            </StackItem>
          </Stack>
        </React.Fragment>
      );
    }

    return (
      <Form>
        <Bullseye>
          <div>
            { this.props.isLoading && (<span color={ '#00b9e4' }> Loading...</span>) }
          </div>
        </Bullseye>
      </Form>
    );
  }
}

OrderServiceFormStepConfiguration.propTypes = {
  orderData: propTypes.func,
  fetchPlans: propTypes.func,
  hideModal: propTypes.func,
  showOrder: propTypes.bool,
  isLoading: propTypes.bool,
  serviceData: propTypes.object,
  servicePlans: propTypes.array,
  stepParametersValid: propTypes.bool,
  fulfilled: propTypes.bool,
  error: propTypes.bool,
  imageUrl: propTypes.string,
  id: propTypes.string,
  name: propTypes.string,
  sendSubmitOrder: propTypes.func.isRequired
};

OrderServiceFormStepConfiguration.defaultProps = {
  servicePlans: []
};

const mapStateToProps = ({ orderReducer: { isLoading, servicePlans }}) => ({
  isLoading,
  servicePlans
});

const mapDispatchToProps = dispatch => ({
  fetchPlans: (portfolioItemId) => dispatch(fetchServicePlans(portfolioItemId)),
  sendSubmitOrder: data => dispatch(sendSubmitOrder(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(OrderServiceFormStepConfiguration);
