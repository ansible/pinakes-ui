import React, { useRef } from 'react';
import { useIntl } from 'react-intl';
import { useLocation } from 'react-router-dom';
import {
  Bullseye,
  Title,
  EmptyState,
  EmptyStateIcon,
  EmptyStateBody,
  EmptyStatePrimary
} from '@patternfly/react-core';
import Exclamation from '@patternfly/react-icons/dist/js/icons/exclamation-icon';
import CatalogLink from '../common/catalog-link';
import styled from 'styled-components';
import apiErrorsMessages from '../../messages/api-errors.messages';

const SourceSpan = styled.span`
  white-space: nowrap;
`;

const CommonApiError = () => {
  const { formatMessage } = useIntl();
  const { state, pathname } = useLocation();
  const translations = useRef({
    titles: {
      '/401': formatMessage(apiErrorsMessages.unauthorizedTitle),
      '/403': formatMessage(apiErrorsMessages.forbiddenTitle)
    },
    description: formatMessage(apiErrorsMessages.unauthorizedDescription, {
      pathname: state?.from?.pathname,
      search: state?.from?.search,
      // eslint-disable-next-line react/display-name
      br: () => <br />,
      // eslint-disable-next-line react/display-name
      nowrap: (chunks) => <SourceSpan>{chunks}</SourceSpan>
    })
  });
  return (
    <Bullseye className="global-primary-background">
      <EmptyState>
        <div>
          <EmptyStateIcon icon={Exclamation} />
        </div>
        <div>
          <Title headingLevel="h1" size="lg">
            {translations.current.titles[pathname]}
          </Title>
        </div>
        <EmptyStateBody>{translations.current.description}</EmptyStateBody>
        <EmptyStatePrimary>
          <CatalogLink pathname="/">
            {formatMessage(apiErrorsMessages.return)}
          </CatalogLink>
        </EmptyStatePrimary>
      </EmptyState>
    </Bullseye>
  );
};

export default CommonApiError;
