import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardBody, Title } from '@patternfly/react-core';
import RequestList from './request-list';
import { useIntl } from 'react-intl';
import requestsMessages from '../../../messages/requests.messages';
import { isStandalone } from '../../../helpers/shared/helpers';

const requestItems = (request) => {
  if (isStandalone()) {
    return request?.extra_data?.subrequests && request.extra_data.subrequests.length > 0 ? request.extra_data.subrequests : [ request ];
  }
  else {
    return request.requests && request.requests.length > 0 ? request.requests : [ request ];
  }
};

const RequestTranscript = ({ request, indexpath }) => {
  const intl = useIntl();
  return (
    <Card>
      <CardBody>
        <Title headingLevel="h5" size="lg" className="pf-u-pl-lg pf-u-pb-lg">{ intl.formatMessage(requestsMessages.requestTranscript) }</Title>
        <RequestList items={ requestItems(request) } indexpath={ indexpath } />
      </CardBody>
    </Card>);
};

RequestTranscript.propTypes = {
  request: PropTypes.shape({
    content: PropTypes.object,
    requests: PropTypes.array
  }).isRequired,
  indexpath: PropTypes.object
};

export default RequestTranscript;
