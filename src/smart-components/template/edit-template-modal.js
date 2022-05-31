import React, { useEffect, useReducer } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { Modal } from '@patternfly/react-core';

import { updateTemplate } from '../../redux/actions/template-actions';
import routes from '../../constants/approval-routes';
import FormRenderer from '../common/form-renderer';
import addTemplateSchema from '../../forms/add-template.schema';
import templateMessages from '../../messages/templates.messages';
import useQuery from '../../utilities/use-query';
import useTemplate from '../../utilities/use-templates';
import { fetchTemplate } from '../../helpers/template/template-helper';
import { TemplateInfoFormLoader } from '../../presentational-components/shared/approval-loader-placeholders';
import commonMessages from '../../messages/common.message';
import FormTemplate from '@data-driven-forms/pf4-component-mapper/form-template';
import { defaultSettings } from '../../helpers/shared/approval-pagination';
import { listNotificationSettings } from '../../helpers/notification/notification-helper';

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
  return { ...tData };
};

const EditTemplate = ({ postMethod, pagination = defaultSettings }) => {
  const dispatch = useDispatch();
  const { push } = useHistory();
  const intl = useIntl();
  const [{ template: id }] = useQuery(['template']);
  const loadedTemplate = useTemplate(id);

  const [
    { initialValues, schema, isLoading },
    stateDispatch
  ] = useReducer(reducer, { isLoading: true });

  useEffect(() => {
    listNotificationSettings().then((notificationSettings) => {
      if (!loadedTemplate) {
        fetchTemplate(id).then((data) =>
          stateDispatch({
            type: 'loaded',
            initialValues: prepareInitialValues(data),
            schema: addTemplateSchema(intl, data, notificationSettings?.data)
          })
        );
      } else {
        stateDispatch({
          type: 'loaded',
          initialValues: prepareInitialValues(loadedTemplate),
          schema: addTemplateSchema(
            intl,
            loadedTemplate,
            notificationSettings?.data
          )
        });
      }
    });
  }, []);

  const onCancel = () => push(routes.templates.index);

  const onSave = ({ description = '', ...values }) => {
    onCancel();
    const templateData = {
      ...values,
      description
    };
    return dispatch(updateTemplate(templateData, intl))
      .then(() => postMethod({ ...pagination }))
      .then(() => push(routes.templates.index));
  };

  return (
    <Modal
      isOpen
      onClose={onCancel}
      title={intl.formatMessage(templateMessages.editInformation)}
      description={
        !isLoading &&
        intl.formatMessage(templateMessages.editTemplateTitle, {
          name: initialValues.title
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
          FormTemplate={(props) => (
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

export default EditTemplate;
