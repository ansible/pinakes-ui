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
  removeNotificationSetting,
  removeNotificationSettings,
  fetchNotificationSetting
} from '../../redux/actions/notification-actions';
import useQuery from '../../utilities/use-query';
import routes from '../../constants/approval-routes';
import useNotification from '../../utilities/use-notifications';
import { FormItemLoader } from '../../presentational-components/shared/approval-loader-placeholders';
import notificationMessages from '../../messages/notification.messages';
import commonMessages from '../../messages/common.message';
import isEmpty from 'lodash/isEmpty';
import { APP_DISPLAY_NAME } from '../../utilities/approval-constants';
import {
  defaultSettings,
  adjustedOffset
} from '../../helpers/shared/approval-pagination';

const RemoveNotificationSettingModal = ({
  ids = [],
  fetchData,
  pagination = defaultSettings,
  resetSelectedNotificationSettings
}) => {
  const dispatch = useDispatch();
  const [
    fetchedNotificationSetting,
    setFetchedNotificationSetting
  ] = useState();
  const [submitting, setSubmitting] = useState(false);
  const { push } = useHistory();
  const [{ notificationSetting: notificationSettingId }] = useQuery([
    'notificationSetting'
  ]);

  const finalId = notificationSettingId || (ids.length === 1 && ids[0]);

  const intl = useIntl();
  const notificationSetting = useNotification(finalId);

  useEffect(() => {
    if (finalId && !notificationSetting) {
      dispatch(fetchNotificationSetting(finalId))
        .then(({ value }) => setFetchedNotificationSetting(value))
        .catch(() => push(routes.notifications.index));
    }
  }, []);

  if (!finalId && ids.length === 0) {
    return null;
  }

  const removeWf = () =>
    (finalId
      ? dispatch(removeNotificationSetting(finalId, intl))
      : dispatch(removeNotificationSettings(ids, intl))
    )
      .catch(() => setSubmitting(false))
      .then(() => push(routes.notifications.index))
      .then(() => resetSelectedNotificationSettings())
      .then(() =>
        fetchData({
          ...pagination,
          offset: adjustedOffset(pagination, finalId ? 1 : ids.length)
        })
      );

  const onCancel = () => push(routes.notifications.index);

  const onSubmit = () => {
    setSubmitting(true);
    return removeWf();
  };

  const dependenciesMessage = () => {
    const wf = notificationSetting || fetchedNotificationSetting;
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
        (fetchedNotificationSetting && fetchedNotificationSetting.name) ||
        (notificationSetting && notificationSetting.name)
      ) : (
        <React.Fragment>
          {ids.length} {intl.formatMessage(notificationMessages.notifications)}
        </React.Fragment>
      )}
    </b>
  );

  const isLoading =
    finalId && !notificationSetting && !fetchedNotificationSetting;

  return (
    <Modal
      isOpen
      variant="small"
      aria-label={intl.formatMessage(
        notificationMessages.removeNotificationAriaLabel,
        {
          count: finalId ? 1 : ids.length
        }
      )}
      header={
        <Title size="2xl" headingLevel="h1">
          <ExclamationTriangleIcon
            size="sm"
            fill="#f0ab00"
            className="pf-u-mr-sm"
          />
          {intl.formatMessage(notificationMessages.removeNotificationTitle, {
            count: finalId ? 1 : ids.length
          })}
        </Title>
      }
      onClose={onCancel}
      actions={[
        <Button
          id="submit-remove-notification-setting"
          ouiaId={'submit-remove-notification-setting'}
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
          id="cancel-remove-notification"
          ouiaId={'cancel-remove-notification'}
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
            intl.formatMessage(
              notificationMessages.removeNotificationDescription,
              {
                name
              }
            )
          ) : (
            intl.formatMessage(
              notificationMessages.removeNotificationDescriptionWithDeps,
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

RemoveNotificationSettingModal.propTypes = {
  fetchData: PropTypes.func.isRequired,
  ids: PropTypes.array,
  resetSelectedNotificationSettings: PropTypes.func.isRequired,
  pagination: PropTypes.shape({
    limit: PropTypes.number,
    offset: PropTypes.number,
    count: PropTypes.number
  })
};

export default RemoveNotificationSettingModal;
