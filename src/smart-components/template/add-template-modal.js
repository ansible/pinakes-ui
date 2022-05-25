import React, { useEffect, useReducer } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { Modal } from '@patternfly/react-core';
import FormTemplate from '@data-driven-forms/pf4-component-mapper/form-template';

import { addTemplate } from '../../redux/actions/template-actions';
import routes from '../../constants/approval-routes';
import FormRenderer from '../common/form-renderer';
import addTemplateSchema from '../../forms/add-template.schema';
import formMessages from '../../messages/form.messages';
import { defaultSettings } from '../../helpers/shared/approval-pagination';
import { listNotificationSettings } from '../../helpers/notification/notification-helper';

const reducer = (state, { type }) => {
  switch (type) {
    case 'loaded':
      return {
        ...state,
        isLoading: false
      };
    default:
      return state;
  }
};

// eslint-disable-next-line react/prop-types
const AddTemplate = ({ postMethod, pagination = defaultSettings }) => {
  const dispatch = useDispatch();
  const { push } = useHistory();
  const intl = useIntl();

  const [{ schema, isLoading }, stateDispatch] = useReducer(reducer, {
    isLoading: true
  });

  useEffect(() => {
    listNotificationSettings().then((data) =>
      stateDispatch({
        type: 'loaded',
        schema: addTemplateSchema(intl, data.data)
      })
    );
  }, []);

  const onSave = ({ ...values }) => {
    return dispatch(
      addTemplate(
        {
          ...values
        },
        intl
      )
    )
      .then(() => push(routes.templates.index))
      .then(() => postMethod({ ...pagination }));
  };

  const onCancel = () => push(routes.templates.index);

  return (
    <Modal
      isOpen
      onClose={onCancel}
      title={intl.formatMessage(formMessages.createTemplateTitle)}
      variant="small"
    >
      <FormRenderer
        onSubmit={onSave}
        onCancel={onCancel}
        schema={addTemplateSchema(intl)}
        FormTemplate={(props) => (
          <FormTemplate
            {...props}
            buttonClassName="pf-u-mt-0"
            disableSubmit={['validating', 'pristine']}
          />
        )}
      />
    </Modal>
  );
};

export default AddTemplate;
