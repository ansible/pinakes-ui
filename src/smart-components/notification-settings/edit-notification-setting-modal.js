import React, { useEffect, useReducer } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { Modal } from '@patternfly/react-core';

import { updateNotificationSetting } from '../../redux/actions/notification-actions';
import routes from '../../constants/approval-routes';
import FormRenderer from '../common/form-renderer';
import { editNotificationSchema } from '../../forms/add-notification.schema';
import notificationMessages from '../../messages/notification.messages';
import useQuery from '../../utilities/use-query';
import useNotification from '../../utilities/use-notifications';
import {
  fetchNotificationSetting,
  listNotificationTypes
} from '../../helpers/notification/notification-helper';
import { TemplateInfoFormLoader } from '../../presentational-components/shared/approval-loader-placeholders';
import commonMessages from '../../messages/common.message';
import FormTemplate from '@data-driven-forms/pf4-component-mapper/form-template';
import { defaultSettings } from '../../helpers/shared/approval-pagination';

const reducer = (state, { type, initialValues, schema }) => {
  switch (type) {
    case 'loaded':
      return {
        ...state,
        initialValues,
        schema,
        isLoading: false
      };
    default:
      return state;
  }
};

const prepareInitialValues = (tData) => {
  return { ...tData, ...tData.settings };
};

const EditNotificationSetting = ({
  postMethod,
  pagination = defaultSettings
}) => {
  const dispatch = useDispatch();
  const { push } = useHistory();
  const intl = useIntl();
  const [{ notificationSetting: id }] = useQuery(['notificationSetting']);
  const loadedNotificationSetting = useNotification(id);

  const [
    { initialValues, schema, isLoading },
    stateDispatch
  ] = useReducer(reducer, { isLoading: true });

  useEffect(() => {
    listNotificationTypes().then((types) => {
      if (!loadedNotificationSetting) {
        fetchNotificationSetting(id).then((data) =>
          stateDispatch({
            type: 'loaded',
            initialValues: prepareInitialValues(data),
            schema: editNotificationSchema(intl, data, types?.data)
          })
        );
      } else {
        stateDispatch({
          type: 'loaded',
          initialValues: prepareInitialValues(loadedNotificationSetting),
          schema: editNotificationSchema(
            intl,
            loadedNotificationSetting,
            types?.data
          )
        });
      }
    });
  }, []);

  const onCancel = () => push(routes.notifications.index);

  const onSave = (values) => {
    onCancel();
    const { id, name, notification_type, settings, ...newSettings } = {
      ...values
    };

    const notificationSettingData = {
      id,
      name,
      notification_type,
      settings: newSettings
    };
    return dispatch(updateNotificationSetting(notificationSettingData, intl))
      .then(() => postMethod({ ...pagination }))
      .then(() => push(routes.notifications.index));
  };

  return (
    <Modal
      isOpen
      onClose={onCancel}
      title={intl.formatMessage(notificationMessages.editInformation)}
      description={
        !isLoading &&
        intl.formatMessage(notificationMessages.editNotificationTitle, {
          name: initialValues.name
        })
      }
      variant="small"
    >
      {isLoading && <TemplateInfoFormLoader />}
      {!isLoading && (
        <FormRenderer
          onSubmit={onSave}
          onCancel={onCancel}
          schema={schema}
          initialValues={initialValues}
          FormNotificationSetting={(props) => (
            <FormTemplate
              {...props}
              submitLabel={intl.formatMessage(commonMessages.save)}
              buttonClassName="pf-u-mt-0"
              disableSubmit={['validating', 'pristine']}
            />
          )}
        />
      )}
    </Modal>
  );
};

export default EditNotificationSetting;
