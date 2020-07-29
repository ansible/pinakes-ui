import React from 'react';
import { Title } from '@patternfly/react-core';
import componentTypes from '@data-driven-forms/react-form-renderer/dist/cjs/component-types';
import orderProcessInfoSchema from './order-process-info.schema';
import labelMessages from '../messages/labels.messages';
import formsMessages from '../messages/forms.messages';

const createOrderProcessSchema = (intl) => ({
  fields: [
    {
      name: 'wizard',
      title: intl.formatMessage(labelMessages.create),
      component: componentTypes.WIZARD,
      inModal: true,
      fields: [
        {
          name: 'general-information',
          showTitle: true,
          customTitle: (
            <Title headingLevel="h1" size="md">
              {' '}
              {intl.formatMessage(formsMessages.enterInfo)}{' '}
            </Title>
          ),
          title: intl.formatMessage(formsMessages.generalInformation),
          nextStep: 'set-groups',
          fields: orderProcessInfoSchema(intl)
        },
        {
          name: 'review',
          title: intl.formatMessage(formsMessages.review),
          fields: [
            {
              name: 'summary',
              component: 'summary'
            }
          ]
        }
      ]
    }
  ]
});

export default createOrderProcessSchema;
