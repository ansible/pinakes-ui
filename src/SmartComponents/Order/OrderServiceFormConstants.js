import React from 'react';
import OrderServiceFormStepInformation from './OrderServiceFormStepInformation';
import OrderServiceFormStepPlan from './OrderServiceFormStepPlan';
import OrderServiceFormStepConfiguration from './OrderServiceFormStepConfiguration';
import OrderServiceFormStepBind from './OrderServiceFormStepBind';
import OrderServiceFormStepResult from './OrderServiceFormStepResult';

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
    title: 'Plan',
    page: OrderServiceFormStepPlan,
    subSteps: []
  },
  {
    step: 3,
    label: '3',
    title: 'Configuration',
    page: OrderServiceFormStepConfiguration,
    subSteps: []
  },
 // {
 //   step: 4,
 //   label: '4',
 //   title: 'Bind',
 //   page: OrderServiceFormStepBind,
 //   subSteps: []
 // },
 // {
 //   step: 5,
 //   label: '5',
 //   title: 'Results',
 //   page: OrderServiceFormStepResult,
 //   subSteps: []
 // }
];

export { OrderServiceFormSteps };