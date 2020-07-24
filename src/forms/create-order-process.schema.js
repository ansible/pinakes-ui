import React from 'react';
import { Title } from '@patternfly/react-core';

import componentTypes from '@data-driven-forms/react-form-renderer/dist/cjs/component-types';

import orderProcessInfoSchema from './order-process-info.schema';

import formMessages from '../messages/form.messages';

const createOrderProcessSchema = (intl) => ({
  fields: [{
    name: 'wizard',
    title: intl.formatMessage(formMessages.createOrderProcessTitle),
    component: componentTypes.WIZARD,
    inModal: true,
    fields: [{
      name: 'general-information',
      showTitle: true,
      customTitle: <Title headingLevel="h1" size="md"> { intl.formatMessage(formMessages.enterInfo) } </Title>,
      title: intl.formatMessage(formMessages.generalInformation),
      nextStep: 'set-groups',
      fields: orderProcessInfoSchema(intl)
    }, {
      name: 'review',
      title: intl.formatMessage(formMessages.review),
      fields: [{
        name: 'summary',
        component: 'summary'
      }]
    }]
  }]
});

export default createOrderProcessSchema;
