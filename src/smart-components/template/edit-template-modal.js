import React, { useEffect, useReducer } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { Modal } from '@patternfly/react-core';

import {
  fetchTemplates,
  updateTemplate
} from '../../redux/actions/template-actions';
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

const prepareInitialValues = (wfData) => {
  const groupOptions = wfData.group_refs.map((group) => ({
    label: group.name,
    value: group.uuid
  }));
  return { ...wfData, group_refs: [], current_groups: groupOptions };
};

const EditTemplate = () => {
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
    if (!loadedTemplate) {
      fetchTemplate(id).then((data) =>
        stateDispatch({
          type: 'loaded',
          initialValues: prepareInitialValues(data),
          schema: addTemplateSchema(intl, data.id)
        })
      );
    } else {
      stateDispatch({
        type: 'loaded',
        initialValues: prepareInitialValues(loadedTemplate),
        schema: addTemplateSchema(intl, loadedTemplate.id)
      });
    }
  }, []);

  const onCancel = () => push(routes.templates.index);

  const onSave = ({ group_refs = [], description = '', ...values }) => {
    onCancel();
    const groups = values.current_groups
      ? values.current_groups.concat(
          group_refs?.filter((item) => values.current_groups.indexOf(item) < 0)
        )
      : group_refs;
    const templateData = {
      ...values,
      description,
      group_refs: groups.map((group) => ({
        name: group.label,
        uuid: group.value
      }))
    };
    delete templateData.current_groups;
    return dispatch(updateTemplate(templateData, intl)).then(() =>
      dispatch(fetchTemplates())
    );
  };

  return (
    <Modal
      isOpen
      onClose={onCancel}
      title={intl.formatMessage(templateMessages.editInformation)}
      description={
        !isLoading &&
        intl.formatMessage(templateMessages.editProcessTitle, {
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
