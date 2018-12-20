import OrderServiceFormStepInformation from './OrderServiceFormStepInformation';
import OrderServiceFormStepConfiguration from './OrderServiceFormStepConfiguration';

const OrderServiceFormSteps = [
  {
    step: 1,
    label: '1',
    title: 'Information',
    page: OrderServiceFormStepInformation,
    subSteps: []
  },
  {
    step: 2,
    label: '2',
    title: 'Configuration',
    page: OrderServiceFormStepConfiguration,
    subSteps: []
  }
];

export { OrderServiceFormSteps };
