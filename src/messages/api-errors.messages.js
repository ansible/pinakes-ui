const { defineMessages } = require('react-intl');

const apiErrorsMessages = defineMessages({
  unauthorizedTitle: {
    id: 'errors.unauthorized.title',
    defaultMessage: 'Unauthorized'
  },
  unauthorizedDescription: {
    id: 'errors.unauthorized.description',
    defaultMessage:
      // eslint-disable-next-line max-len
      'You are not authorized to access this section: <nowrap>{pathname} {search}</nowrap>. <br></br>If you believe this is a mistake, please contact support.'
  },
  forbiddenTitle: {
    id: 'errors.forbidden.title',
    defaultMessage: 'Forbidden'
  },
  return: {
    id: 'errors.unauthorized.return',
    defaultMessage: 'Return to catalog'
  }
});

export default apiErrorsMessages;
