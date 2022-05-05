import React, { useEffect, useReducer } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { Modal } from '@patternfly/react-core';
import FormTemplate from '@data-driven-forms/pf4-component-mapper/form-template';

import { addNotificationSetting } from '../../redux/actions/notification-actions';
import routes from '../../constants/approval-routes';
import FormRenderer from '../common/form-renderer';
import addNotificationSettingSchema from '../../forms/add-notification.schema';
import formMessages from '../../messages/form.messages';
import { defaultSettings } from '../../helpers/shared/approval-pagination';
import { TemplateInfoFormLoader } from '../../presentational-components/shared/approval-loader-placeholders';
import { listNotificationTypes } from '../../helpers/notification/notification-helper';

const reducer = (state, { type, schema }) => {
  switch (type) {
    case 'loaded':
      return {
        ...state,
        schema,
        isLoading: false
      };
    default:
      return state;
  }
};

// eslint-disable-next-line react/prop-types
const AddNotificationSetting = ({
  postMethod,
  pagination = defaultSettings
}) => {
  const dispatch = useDispatch();
  const { push } = useHistory();
  const intl = useIntl();

  const [{ schema, isLoading }, stateDispatch] = useReducer(reducer, {
    isLoading: true
  });

  useEffect(() => {
    listNotificationTypes().then((data) =>
      stateDispatch({
        type: 'loaded',
        schema: addNotificationSettingSchema(intl, data.data)
      })
    );
  }, []);

  const onSave = (data) => {
    const { name, notification_type, ...settings } = data;
    return dispatch(
      addNotificationSetting(
        {
          notification_type,
          name,
          settings
        },
        intl
      )
    )
      .then(() => push(routes.notifications.index))
      .then(() => postMethod({ ...pagination }));
  };

  const onCancel = () => push(routes.notifications.index);

  return (
    <Modal
      isOpen
      onClose={onCancel}
      title={intl.formatMessage(formMessages.createNotificationSettingTitle)}
      variant="small"
    >
      {isLoading && <TemplateInfoFormLoader />}
      {!isLoading && (
        <FormRenderer
          onSubmit={onSave}
          onCancel={onCancel}
          schema={schema}
          FormTemplate={(props) => (
            <FormTemplate
              {...props}
              buttonClassName="pf-u-mt-0"
              disableSubmit={['validating', 'pristine']}
            />
          )}
        />
      )}
    </Modal>
  );
};

export default AddNotificationSetting;
