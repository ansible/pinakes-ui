/* eslint-disable react/prop-types */
import React, { ReactNode, useContext, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FormRenderer from '../common/form-renderer';
import { createPortfolioSchema } from '../../forms/portfolio-form.schema';
import {
  addPortfolio,
  updatePortfolio
} from '../../redux/actions/portfolio-actions';
import {
  addPortfolio as addPortfolioS,
  updatePortfolio as updatePortfolioS
} from '../../redux/actions/portfolio-actions-s';
import useQuery from '../../utilities/use-query';
import { getPortfolioFromState } from '../../helpers/portfolio/portfolio-helper';
import { getPortfolioFromState as getPortfolioFromStateS } from '../../helpers/portfolio/portfolio-helper-s';
import useEnhancedHistory from '../../utilities/use-enhanced-history';
import { UnauthorizedRedirect } from '../error-pages/error-redirects';
import { PORTFOLIO_ROUTE } from '../../constants/routes';
import actionMessages from '../../messages/actions.messages';
import portfolioMessages from '../../messages/portfolio.messages';
import labelMessages from '../../messages/labels.messages';
import useFormatMessage from '../../utilities/use-format-message';
import { CatalogLinkTo } from '../common/catalog-link';
import { PaginationConfiguration } from '../../helpers/shared/pagination';
import { CatalogRootState } from '../../types/redux';
import { Portfolio } from '@redhat-cloud-services/catalog-client';
import { InternalPortfolio } from '../../types/common-types';
import { isStandalone } from '../../helpers/shared/helpers';

export interface AddPortfolioModalProps {
  removeQuery?: boolean;
  closeTarget: CatalogLinkTo;
  viewState?: PaginationConfiguration;
}
const AddPortfolioModal: React.ComponentType<AddPortfolioModalProps> = ({
  removeQuery,
  closeTarget,
  viewState
}) => {
  const formatMessage = useFormatMessage();
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(true);
  const [{ portfolio: portfolioId }] = useQuery(['portfolio']);
  const { push } = useEnhancedHistory({
    removeSearch: removeQuery,
    keepHash: true
  });
  console.log('AddPortfolioModal: portfolio: ', portfolioId);
  const initialValues = useSelector<
    CatalogRootState,
    InternalPortfolio | undefined
  >(({ portfolioReducer }) =>
    isStandalone()
      ? (getPortfolioFromStateS(portfolioReducer, portfolioId) as
          | InternalPortfolio
          | undefined)
      : (getPortfolioFromState(portfolioReducer, portfolioId) as
          | InternalPortfolio
          | undefined)
  );

  const onAddPortfolio = async (data: Partial<Portfolio>) => {
    const notification = {
      variant: 'success',
      title: formatMessage(portfolioMessages.addSuccessTitle),
      description: formatMessage(portfolioMessages.addSuccessDescription, {
        name: data.name,
        // eslint-disable-next-line react/display-name
        b: (chunks: ReactNode) => <b key="strong">{chunks}</b>
      })
    };
    const newPortfolio = await dispatch(
      isStandalone()
        ? (addPortfolioS(data, notification) as Promise<{ value: Portfolio }>)
        : (addPortfolio(data, notification) as Promise<{ value: Portfolio }>)
    );
    return newPortfolio && newPortfolio.value && newPortfolio.value.id
      ? push({
          pathname: PORTFOLIO_ROUTE,
          search: `?portfolio=${newPortfolio.value.id}`
        })
      : push(closeTarget);
  };

  const onSubmit = (data: Portfolio) => {
    if (initialValues) {
      /**
       * Fake the redirect by closing the modal
       */
      setIsOpen(false);
      return dispatch(
        (isStandalone()
          ? updatePortfolioS(data, viewState)
          : (updatePortfolio(data, viewState) as unknown)) as Promise<void>
      ).then(() =>
        /**
         * Redirect only after the update was finished.
         * This will ensure that API requests are triggered in correct order when changing the router pathname
         * */
        push(closeTarget)
      );
    } else {
      return onAddPortfolio(data);
    }
  };

  if (initialValues?.metadata?.user_capabilities?.update === false) {
    return <UnauthorizedRedirect />;
  }

  return (
    <FormRenderer
      schema={createPortfolioSchema(portfolioId)}
      onSubmit={onSubmit}
      onCancel={() => push(closeTarget)}
      initialValues={{ ...initialValues }}
      isModal
      modalProps={{
        title: portfolioId
          ? (formatMessage(portfolioMessages.modalEditTitle) as string)
          : (formatMessage(portfolioMessages.modalCreateTitle) as string),
        isOpen,
        onClose: () => push(closeTarget),
        variant: 'small'
      }}
      templateProps={{
        submitLabel: portfolioId
          ? formatMessage(actionMessages.save)
          : formatMessage(labelMessages.create)
      }}
    />
  );
};

export default AddPortfolioModal;
