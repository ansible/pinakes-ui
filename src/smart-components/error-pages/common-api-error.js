import React from 'react';
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

const TITLES = {
  '/401': 'Unauthorized'
};

const MESSAGES = {
  '/401': 'You are not auhtorized to access this section: '
};

const CommonApiError = () => {
  const {
    state: { from },
    pathname
  } = useLocation();

  return (
    <Bullseye className="global-primary-background">
      <EmptyState>
        <div>
          <EmptyStateIcon icon={Exclamation} />
        </div>
        <div>
          <Title size="lg">{TITLES[pathname]}</Title>
        </div>
        <EmptyStateBody>
          {MESSAGES[pathname]} {from.pathname}. If you believe this is a
          mistake, please contact support.
        </EmptyStateBody>
        <EmptyStatePrimary>
          <CatalogLink pathname="/">Return to catalog</CatalogLink>
        </EmptyStatePrimary>
      </EmptyState>
    </Bullseye>
  );
};

export default CommonApiError;
