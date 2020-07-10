import React, { useRef } from 'react';
import { FormattedMessage } from 'react-intl';
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

const SourceSpan = styled.span`
  white-space: nowrap;
`;

const CommonApiError = () => {
  const translations = useRef({
    titles: {
      '/401': (
        <FormattedMessage
          id="error.unauthorized"
          defaultMessage="Unauthorized"
        />
      ),
      '/403': (
        <FormattedMessage id="error.forbidden" defaultMessage="Forbidden" />
      )
    },
    messages: {
      '/401': 'You are not authorized to access this section: ',
      '/403': 'You are not authorized to access this section: '
    }
  });
  const { state, pathname } = useLocation();

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
        <EmptyStateBody>
          {translations.current.messages[pathname]}
          <SourceSpan>
            {state?.from?.pathname}
            {state?.from?.search}
          </SourceSpan>
          <br />
          <FormattedMessage
            id="error.contact.support"
            defaultMessage="If you believe this is a mistake, please contact support."
          />
        </EmptyStateBody>
        <EmptyStatePrimary>
          <CatalogLink pathname="/">
            <FormattedMessage
              id="error.return"
              defaultMessage="Return to catalog"
            />
          </CatalogLink>
        </EmptyStatePrimary>
      </EmptyState>
    </Bullseye>
  );
};

export default CommonApiError;
