import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ExclamationTriangleIcon } from '@patternfly/react-icons';
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
import portfolioMessages from '../../messages/portfolio.messages';
import actionMessages from '../../messages/actions.messages';
import labelMessages from '../../messages/labels.messages';
import useFormatMessage from '../../utilities/use-format-message';

const RemovePortfolioModal = ({ viewState }) => {
  const formatMessage = useFormatMessage();
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
      aria-label={formatMessage(portfolioMessages.portfolioRemoveTitle)}
      header={
        <TextContent>
          <Split hasGutter>
            <SplitItem>
              <ExclamationTriangleIcon size="lg" fill="#f0ab00" />
            </SplitItem>
            <SplitItem>
              <Text component="h1" size="2xl">
                {formatMessage(portfolioMessages.portfolioRemoveTitle)}
              </Text>
            </SplitItem>
          </Split>
        </TextContent>
      }
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
          {formatMessage(actionMessages.delete)}
        </Button>,
        <Button key="cancel" variant="link" type="button" onClick={goBack}>
          {formatMessage(labelMessages.cancel)}
        </Button>
      ]}
    >
      <TextContent>
        <Text component={TextVariants.p}>
          {formatMessage(portfolioMessages.portfolioRemoveDescription, {
            name: portfolio.name
          })}
        </Text>
      </TextContent>
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
