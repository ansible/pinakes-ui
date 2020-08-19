import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import useFormatMessage from '../../utilities/use-format-message';
import orderProcessesMessages from '../../messages/order-processes.messages';
import { useHistory } from 'react-router-dom';
import {
  listOrderProcesses,
  getLinkedOrderProcesses
} from '../../helpers/order-process/order-process-helper';
import { setOrderProcess } from '../../redux/actions/order-process-actions';
import { APP_NAME } from '../../utilities/constants';
import useQuery from '../../utilities/use-query';
import TaggingModal from '../common/tagging-modal';
import { Bold } from '../../presentational-components/shared/intl-rich-text-components';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications/cjs/actions';

const SetOrderProcessModal = ({ pushParam, objectType, querySelector }) => {
  const dispatch = useDispatch();
  const formatMessage = useFormatMessage();
  const { push } = useHistory();
  const onCancel = () => push(pushParam);
  const [query] = useQuery([querySelector]);
  const loadOrderProcesses = (filter) =>
    listOrderProcesses(filter).then(({ data }) =>
      data.map(({ name, id }) => ({ label: name, value: id }))
    );

  const onSubmit = (toLink, toUnlink) => {
    onCancel();
    dispatch(
      setOrderProcess(toLink, toUnlink, {
        object_type: objectType,
        app_name: APP_NAME[objectType],
        object_id: query[querySelector]
      })
    ).then(() =>
      dispatch(
        addNotification({
          dismissable: true,
          variant: 'success',
          title: formatMessage(
            orderProcessesMessages.setOrderProcessNotificationTitle
          ),
          description: formatMessage(
            orderProcessesMessages.setOrderProcessNotificationDescription,
            {
              linked: toLink.length,
              unlinked: toUnlink.length
            }
          )
        })
      )
    );
  };

  return (
    <TaggingModal
      getInitialTags={() =>
        getLinkedOrderProcesses(objectType, query[querySelector]).then(
          ({ data }) => data
        )
      }
      title={formatMessage(orderProcessesMessages.setOrderProcess)}
      onClose={onCancel}
      onSubmit={onSubmit}
      loadTags={loadOrderProcesses}
      existingTagsMessage={formatMessage(
        orderProcessesMessages.currentOrderProcesses
      )}
      subTitle={formatMessage(orderProcessesMessages.setOrderProcessSubtitle, {
        strong: Bold,
        objectType
      })}
    />
  );
};

SetOrderProcessModal.propTypes = {
  pushParam: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
    search: PropTypes.string
  }).isRequired,
  objectType: PropTypes.oneOf(['PortfolioItem', 'Portfolio']).isRequired,
  querySelector: PropTypes.string.isRequired
};

export default SetOrderProcessModal;
