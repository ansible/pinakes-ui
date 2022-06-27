/* eslint-disable react/prop-types */
import React from 'react';
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
import { removePortfolio as removePortfolioS } from '../../redux/actions/portfolio-actions-s';
import useQuery from '../../utilities/use-query';
import { getPortfolioFromState } from '../../helpers/portfolio/portfolio-helper';
import { getPortfolioFromState as getPortfolioFromStateS } from '../../helpers/portfolio/portfolio-helper-s';
import { PORTFOLIOS_ROUTE } from '../../constants/routes';
import { UnauthorizedRedirect } from '../error-pages/error-redirects';
import {
  defaultSettings,
  PaginationConfiguration
} from '../../helpers/shared/pagination';
import portfolioMessages from '../../messages/portfolio.messages';
import actionMessages from '../../messages/actions.messages';
import labelMessages from '../../messages/labels.messages';
import useFormatMessage from '../../utilities/use-format-message';
import { CatalogRootState } from '../../types/redux';
import { InternalPortfolio } from '../../types/common-types';
import { isStandalone } from '../../helpers/shared/helpers';

export interface RemovePortfolioModalProps {
  viewState?: PaginationConfiguration;
}
const RemovePortfolioModal: React.ComponentType<RemovePortfolioModalProps> = ({
  viewState = defaultSettings
}) => {
  const formatMessage = useFormatMessage();
  const [{ portfolio: portfolioId }] = useQuery(['portfolio']);
  const dispatch = useDispatch();
  const portfolio = useSelector<
    CatalogRootState,
    InternalPortfolio | undefined
  >(({ portfolioReducer }) =>
    isStandalone()
      ? getPortfolioFromStateS(portfolioReducer, portfolioId)
      : getPortfolioFromState(portfolioReducer, portfolioId)
  );
  const { push, goBack } = useHistory();
  const onSubmit = () => {
    push(PORTFOLIOS_ROUTE);
    return dispatch(
      isStandalone()
        ? removePortfolioS(portfolioId, viewState)
        : removePortfolio(portfolioId, viewState)
    );
  };

  if (!portfolio) {
    return null;
  }

  const destroy = portfolio.metadata?.user_capabilities?.destroy;

  return destroy === false ? (
    <UnauthorizedRedirect />
  ) : (
    <Modal
      aria-label={
        formatMessage(portfolioMessages.portfolioRemoveTitle) as string
      }
      header={
        <TextContent>
          <Split hasGutter>
            <SplitItem>
              <ExclamationTriangleIcon size="lg" style={{ fill: '#f0ab00' }} />
            </SplitItem>
            <SplitItem>
              <Text component="h1">
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
          ouiaId="confirm-delete-portfolio"
          onClick={onSubmit}
        >
          {formatMessage(actionMessages.delete)}
        </Button>,
        <Button
          key="cancel"
          ouiaId="cancel"
          variant="link"
          type="button"
          onClick={goBack}
        >
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

export default RemovePortfolioModal;
