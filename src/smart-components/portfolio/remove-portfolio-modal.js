import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { WarningTriangleIcon } from '@patternfly/react-icons';
import {
  Modal,
  Button,
  Text,
  TextVariants,
  TextContent,
  Split,
  SplitItem
} from '@patternfly/react-core';
import { removePortfolio } from '../../redux/actions/portfolio-actions';
import useQuery from '../../utilities/use-query';
import { getPortfolioFromState } from '../../helpers/portfolio/portfolio-helper';
import { PORTFOLIOS_ROUTE } from '../../constants/routes';
import { UnauthorizedRedirect } from '../error-pages/error-redirects';
import { defaultSettings } from '../../helpers/shared/pagination';
import { defineMessages, useIntl, defineMessage } from 'react-intl';

const getWarningMessage = (name) =>
  defineMessage({
    id: 'portfolio.remove.modal.description',
    defaultMessages:
      'This action will permanently delete portfolio {name} and its data.',
    values: { name }
  });

const messages = defineMessages({
  title: {
    id: 'portfolio.remove.modal.title',
    defaultMessages: 'Delete Portfolio?'
  },
  confirm: {
    id: 'portfolio.remove.modal.confirm',
    defaultMessages: 'Confirm'
  },
  cancel: {
    id: 'portfolio.remove.modal.cancel',
    defaultMessages: 'Cancel'
  }
});

const RemovePortfolioModal = ({ viewState }) => {
  const { formatMessage } = useIntl();
  const [{ portfolio: portfolioId }] = useQuery(['portfolio']);
  const dispatch = useDispatch();
  const portfolio = useSelector(({ portfolioReducer }) =>
    getPortfolioFromState(portfolioReducer, portfolioId)
  );
  const { push, goBack } = useHistory();
  const onSubmit = () => {
    push(PORTFOLIOS_ROUTE);
    return dispatch(removePortfolio(portfolioId, viewState));
  };

  if (!portfolio) {
    return null;
  }

  const {
    metadata: {
      user_capabilities: { destroy }
    }
  } = portfolio;

  return destroy === false ? (
    <UnauthorizedRedirect />
  ) : (
    <Modal
      title={formatMessage(messages.title)}
      isOpen
      variant="small"
      onClose={goBack}
      actions={[
        <Button
          key="submit"
          variant="danger"
          type="button"
          id="confirm-delete-portfolio"
          onClick={onSubmit}
        >
          {formatMessage(messages.confirm)}
        </Button>,
        <Button key="cancel" variant="link" type="button" onClick={goBack}>
          {formatMessage(messages.cancel)}
        </Button>
      ]}
    >
      <Split hasGutter>
        <SplitItem>
          <WarningTriangleIcon size="xl" fill="#f0ab00" />
        </SplitItem>
        <SplitItem>
          <TextContent>
            <Text component={TextVariants.p}>
              {getWarningMessage(portfolio.name)}
            </Text>
          </TextContent>
        </SplitItem>
      </Split>
    </Modal>
  );
};

RemovePortfolioModal.propTypes = {
  viewState: PropTypes.shape({
    count: PropTypes.number,
    limit: PropTypes.number,
    offset: PropTypes.number,
    filter: PropTypes.string
  })
};

RemovePortfolioModal.defaultProps = {
  viewState: defaultSettings
};

export default RemovePortfolioModal;
