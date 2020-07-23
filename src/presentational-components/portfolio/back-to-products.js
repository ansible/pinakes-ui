import React from 'react';
import { useIntl } from 'react-intl';
import { Button } from '@patternfly/react-core';
import AngleLeftIcon from '@patternfly/react-icons/dist/js/icons/angle-left-icon';

import portfolioMessages from '../../messages/portfolio.messages';
import CatalogLink from '../../smart-components/common/catalog-link';

const BackToProducts = () => {
  const { formatMessage } = useIntl();
  return (
    <div className="pf-u-mb-md">
      <AngleLeftIcon className="pf-u-mr-sm" />
      <Button
        variant="link"
        component={() => (
          <CatalogLink pathname="/products">
            {formatMessage(portfolioMessages.backToProducts)}
          </CatalogLink>
        )}
      />
    </div>
  );
};

export default BackToProducts;
