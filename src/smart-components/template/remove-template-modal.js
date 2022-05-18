import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  Modal,
  Button,
  Text,
  TextContent,
  TextVariants,
  Spinner,
  Title
} from '@patternfly/react-core';
import { useIntl } from 'react-intl';
import { ExclamationTriangleIcon } from '@patternfly/react-icons';
import {
  removeTemplate,
  removeTemplates,
  fetchTemplate
} from '../../redux/actions/template-actions';
import useQuery from '../../utilities/use-query';
import routes from '../../constants/approval-routes';
import useTemplate from '../../utilities/use-templates';
import { FormItemLoader } from '../../presentational-components/shared/approval-loader-placeholders';
import templateMessages from '../../messages/templates.messages';
import commonMessages from '../../messages/common.message';
import isEmpty from 'lodash/isEmpty';
import { APP_DISPLAY_NAME } from '../../utilities/approval-constants';
import {
  defaultSettings,
  adjustedOffset
} from '../../helpers/shared/approval-pagination';

const RemoveTemplateModal = ({
  ids = [],
  fetchData,
  pagination = defaultSettings,
  resetSelectedTemplates
}) => {
  const dispatch = useDispatch();
  const [fetchedTemplate, setFetchedTemplate] = useState();
  const [submitting, setSubmitting] = useState(false);
  const { push } = useHistory();
  const [{ template: templateId }] = useQuery(['template']);

  const finalId = templateId || (ids.length === 1 && ids[0]);

  const intl = useIntl();
  const template = useTemplate(finalId);

  useEffect(() => {
    if (finalId && !template) {
      dispatch(fetchTemplate(finalId))
        .then(({ value }) => setFetchedTemplate(value))
        .catch(() => push(routes.templates.index));
    }
  }, []);

  if (!finalId && ids.length === 0) {
    return null;
  }

  const removeWf = () =>
    (finalId
      ? dispatch(removeTemplate(finalId, intl))
      : dispatch(removeTemplates(ids, intl))
    )
      .catch(() => setSubmitting(false))
      .then(() => push(routes.templates.index))
      .then(() => resetSelectedTemplates())
      .then(() =>
        fetchData({
          ...pagination,
          offset: adjustedOffset(pagination, finalId ? 1 : ids.length)
        })
      );

  const onCancel = () => push(routes.templates.index);

  const onSubmit = () => {
    setSubmitting(true);
    return removeWf();
  };

  const dependenciesMessage = () => {
    const wf = template || fetchedTemplate;
    if (
      !wf ||
      isEmpty(wf) ||
      !wf.metadata ||
      !wf.metadata.object_dependencies ||
      isEmpty(wf.metadata.object_dependencies)
    ) {
      return [];
    }

    return Object.keys(wf.metadata.object_dependencies).reduce(
      (acc, item) => [...acc, `${APP_DISPLAY_NAME[item] || item}`],
      []
    );
  };

  const name = (
    <b key="remove-key">
      {finalId ? (
        (fetchedTemplate && fetchedTemplate.title) ||
        (template && template.title)
      ) : (
        <React.Fragment>
          {ids.length} {intl.formatMessage(templateMessages.templates)}
        </React.Fragment>
      )}
    </b>
  );
  const isLoading = finalId && !template && !fetchedTemplate;

  return (
    <Modal
      isOpen
      variant="small"
      aria-label={intl.formatMessage(templateMessages.removeTemplateAriaLabel, {
        count: finalId ? 1 : ids.length
      })}
      header={
        <Title size="2xl" headingLevel="h1">
          <ExclamationTriangleIcon
            size="sm"
            fill="#f0ab00"
            className="pf-u-mr-sm"
          />
          {intl.formatMessage(templateMessages.removeTemplateTitle, {
            count: finalId ? 1 : ids.length
          })}
        </Title>
      }
      onClose={onCancel}
      actions={[
        <Button
          id="submit-remove-template"
          ouiaId={'submit-remove-template'}
          key="submit"
          variant="danger"
          type="button"
          isDisabled={submitting}
          onClick={onSubmit}
        >
          {submitting ? (
            <React.Fragment>
              <Spinner size="sm" className="pf-u-mr-md" />
              {intl.formatMessage(commonMessages.deleting)}
            </React.Fragment>
          ) : (
            intl.formatMessage(commonMessages.delete)
          )}
        </Button>,
        <Button
          id="cancel-remove-template"
          ouiaId={'cancel-remove-template'}
          key="cancel"
          variant="link"
          type="button"
          isDisabled={submitting}
          onClick={onCancel}
        >
          {intl.formatMessage(commonMessages.cancel)}
        </Button>
      ]}
    >
      <TextContent>
        <Text component={TextVariants.p}>
          {isLoading ? (
            <FormItemLoader />
          ) : isEmpty(dependenciesMessage()) ? (
            intl.formatMessage(templateMessages.removeTemplateDescription, {
              name
            })
          ) : (
            intl.formatMessage(
              templateMessages.removeTemplateDescriptionWithDeps,
              {
                name,
                dependenciesList: (
                  <span key="span" className="pf-u-mt-lg span-block">
                    {dependenciesMessage().map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </span>
                )
              }
            )
          )}
        </Text>
      </TextContent>
    </Modal>
  );
};

RemoveTemplateModal.propTypes = {
  fetchData: PropTypes.func.isRequired,
  ids: PropTypes.array,
  resetSelectedTemplates: PropTypes.func.isRequired,
  pagination: PropTypes.shape({
    limit: PropTypes.number,
    offset: PropTypes.number,
    count: PropTypes.number
  })
};

export default RemoveTemplateModal;
