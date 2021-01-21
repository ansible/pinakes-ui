/* eslint-disable react/prop-types */
import React from 'react';
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
import TaggingModal, { Tag } from '../common/tagging-modal';
import { Bold } from '../../presentational-components/shared/intl-rich-text-components';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications/redux';
import { CatalogLinkTo } from '../common/catalog-link';
import { SelectOptions } from '../../types/common-types';

export interface SetOrderProcessModalProps {
  pushParam: CatalogLinkTo;
  objectType: 'PortfolioItem' | 'Portfolio';
  objectName: () => string | undefined;
  querySelector: string;
}
const SetOrderProcessModal: React.ComponentType<SetOrderProcessModalProps> = ({
  pushParam,
  objectType,
  querySelector,
  objectName
}) => {
  const dispatch = useDispatch();
  const formatMessage = useFormatMessage();
  const { push } = useHistory();
  const onCancel = () => push(pushParam);
  const [query] = useQuery([querySelector]);
  const loadOrderProcesses = (filter: string): Promise<SelectOptions> =>
    listOrderProcesses(filter).then(({ data }) =>
      data.map(({ name, id }) => ({ label: name, value: id }))
    );

  const onSubmit = (toLink: string[], toUnlink: string[]) => {
    onCancel();
    dispatch(
      setOrderProcess(toLink, toUnlink, {
        object_type: objectType,
        app_name: APP_NAME[objectType],
        object_id: query[querySelector]
      }) as Promise<void>
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
          ({ data }) => data as Tag[]
        )
      }
      title={formatMessage(orderProcessesMessages.setOrderProcess) as string}
      onClose={onCancel}
      onSubmit={onSubmit}
      loadTags={loadOrderProcesses}
      existingTagsMessage={formatMessage(
        orderProcessesMessages.currentOrderProcesses
      )}
      subTitle={formatMessage(orderProcessesMessages.setOrderProcessSubtitle, {
        strong: Bold,
        object: objectName()
      })}
    />
  );
};

export default SetOrderProcessModal;
