import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import difference from 'lodash/difference';
import { useDispatch } from 'react-redux';
import { Modal } from '@patternfly/react-core';
import useFormatMessage from '../../utilities/use-format-message';
import orderProcessesMessages from '../../messages/order-processes.messages';
import FormRenderer from '../common/form-renderer';
import createSchema from '../../forms/set-approval-process.schema';
import { useHistory } from 'react-router-dom';
import {
  listOrderProcesses,
  getLinkedOrderProcesses
} from '../../helpers/order-process/order-process-helper';
import { setOrderProcess } from '../../redux/actions/order-process-actions';
import { APP_NAME } from '../../utilities/constants';
import useQuery from '../../utilities/use-query';
import { WorkflowLoader } from '../../presentational-components/shared/loader-placeholders';

const SetOrderProcessModal = ({ pushParam, objectType, querySelector }) => {
  const dispatch = useDispatch();
  const formatMessage = useFormatMessage();
  const [data, setData] = useState();
  const { push } = useHistory();
  const onCancel = () => push(pushParam);
  const [query] = useQuery([querySelector]);
  const loadOrderProcesses = (filter) =>
    listOrderProcesses(filter).then(({ data }) =>
      data.map(({ name, id }) => ({ label: name, value: id }))
    );
  useEffect(() => {
    getLinkedOrderProcesses(objectType, query[querySelector]).then(({ data }) =>
      setData(data)
    );
  }, []);
  const onSubmit = (formData) => {
    onCancel();
    const unlinkArray = data
      .filter(
        ({ id }) =>
          !formData['initial-processes'].find((process) => id === process.id)
      )
      .map(({ id }) => id);
    /**
     * prevent uneccesary unlink and link API calls of the same workflow
     */
    const linkDiff = difference(formData['new-processes'], unlinkArray);
    const unLinkDiff = difference(unlinkArray, formData['new-processes']);
    const toLinkProcesses = linkDiff.filter(
      (id) => !data.find((item) => item.id === id)
    );
    const toUnlinkProcesses = unLinkDiff.filter((id) =>
      data.find((item) => item.id === id)
    );
    if (toUnlinkProcesses.length > 0 || toLinkProcesses.length > 0) {
      dispatch(
        setOrderProcess(toLinkProcesses, toUnlinkProcesses, {
          object_type: objectType,
          app_name: APP_NAME[objectType],
          object_id: query[querySelector]
        })
      );
    }
  };

  return (
    <Modal
      isOpen
      title={formatMessage(orderProcessesMessages.setOrderProcess)}
      onClose={onCancel}
      variant="small"
    >
      {!data ? (
        <WorkflowLoader />
      ) : (
        <FormRenderer
          initialValues={{
            'initial-processes': data
          }}
          schema={createSchema(formatMessage, loadOrderProcesses)}
          onSubmit={onSubmit}
          onCancel={onCancel}
          clearedValue={[]}
        />
      )}
    </Modal>
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
