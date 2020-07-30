import React from 'react';
import { Button } from '@patternfly/react-core';
import AngleLeftIcon from '@patternfly/react-icons/dist/js/icons/angle-left-icon';

import portfolioMessages from '../../messages/portfolio.messages';
import CatalogLink from '../../smart-components/common/catalog-link';
import useFormatMessage from '../../utilities/use-format-message';

const BackToProducts = () => {
  const formatMessage = useFormatMessage();
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
