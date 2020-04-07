import React from 'react';
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

const RemovePortfolioModal = () => {
  const [{ portfolio: portfolioId }] = useQuery(['portfolio']);
  const dispatch = useDispatch();
  const portfolio = useSelector(({ portfolioReducer }) =>
    getPortfolioFromState(portfolioReducer, portfolioId)
  );
  const { push, goBack } = useHistory();
  const onSubmit = () => {
    push(PORTFOLIOS_ROUTE);
    return dispatch(removePortfolio(portfolioId));
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
      title="Delete Portfolio?"
      isOpen
      isSmall
      onClose={goBack}
      isFooterLeftAligned
      actions={[
        <Button key="submit" variant="danger" type="button" onClick={onSubmit}>
          Confirm
        </Button>,
        <Button key="cancel" variant="link" type="button" onClick={goBack}>
          Cancel
        </Button>
      ]}
    >
      <Split gutter="md">
        <SplitItem>
          <WarningTriangleIcon size="xl" fill="#f0ab00" />
        </SplitItem>
        <SplitItem>
          <TextContent>
            <Text component={TextVariants.p}>
              This action will permanently delete portfolio {portfolio.name} and
              its data.
            </Text>
          </TextContent>
        </SplitItem>
      </Split>
    </Modal>
  );
};

export default RemovePortfolioModal;
