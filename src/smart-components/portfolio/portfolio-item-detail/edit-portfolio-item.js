import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { useLocation, useHistory } from 'react-router-dom';

import FormRenderer from '../../common/form-renderer';
import editPortfolioItemSchema from '../../../forms/edit-portfolio-item-form.schema';
import { updatePortfolioItem } from '../../../redux/actions/portfolio-actions';
import { updatePortfolioItem as updatePortfolioItemS } from '../../../redux/actions/portfolio-actions-s';
import { Stack, StackItem } from '@patternfly/react-core';
import IconUpload from './icon-upload';
import { CATALOG_API_BASE } from '../../../utilities/constants';
import CardIcon from '../../../presentational-components/shared/card-icon';

const EditPortfolioItem = ({
  cancelUrl,
  uploadIcon,
  resetIcon,
  product: { owner, created_at, updated_at, ...product },
  userCapabilities
}) => {
  const dispatch = useDispatch();
  const { push } = useHistory();
  const { search } = useLocation();
  return (
    <Stack hasGutter>
      <StackItem key={product.icon_id || 'default'}>
        <IconUpload
          uploadIcon={uploadIcon}
          resetIcon={resetIcon}
          enableReset={!!product.icon_id}
        >
          <CardIcon
            src={`${CATALOG_API_BASE}/portfolio_items/${
              product.id
            }/icon?cache_id=${product.icon_id || 'default'}`} // we need ho add the query to prevent the browser caching when reseting the image
            sourceId={product.service_offering_source_ref}
            height={64}
          />
        </IconUpload>
      </StackItem>
      <StackItem>
        <FormRenderer
          initialValues={{ ...product }}
          onSubmit={(values) => {
            push({
              pathname: cancelUrl,
              search
            });
            return dispatch(
              window.catalog?.standalone
                ? updatePortfolioItemS({
                    ...values,
                    metadata: { user_capabilities: userCapabilities }
                  })
                : updatePortfolioItem({
                    ...values,
                    metadata: { user_capabilities: userCapabilities }
                  })
            );
          }}
          schema={editPortfolioItemSchema}
          templateProps={{
            disableSubmit: ['pristine']
          }}
          onCancel={() =>
            push({
              pathname: cancelUrl,
              search
            })
          }
        />
      </StackItem>
    </Stack>
  );
};

EditPortfolioItem.propTypes = {
  cancelUrl: PropTypes.string.isRequired,
  product: PropTypes.object.isRequired,
  userCapabilities: PropTypes.object.isRequired,
  uploadIcon: PropTypes.func.isRequired,
  resetIcon: PropTypes.func.isRequired
};

export default EditPortfolioItem;
