import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { useLocation, useHistory } from 'react-router-dom';

import FormRenderer from '../../common/form-renderer';
import editPortfolioItemSchema from '../../../forms/edit-portfolio-item-form.schema';
import { updatePortfolioItem } from '../../../redux/actions/portfolio-actions';
import { Stack, StackItem } from '@patternfly/react-core';
import IconUpload from './icon-upload';
import { CATALOG_API_BASE } from '../../../utilities/constants';
import CardIcon from '../../../presentational-components/shared/card-icon';

const EditPortfolioItem = ({
  cancelUrl,
  uploadIcon,
  product: { owner, created_at, updated_at, ...product },
  userCapabilities
}) => {
  const dispatch = useDispatch();
  const { push } = useHistory();
  const { search } = useLocation();
  return (
    <Stack hasGutter>
      <StackItem>
        <IconUpload uploadIcon={uploadIcon}>
          <CardIcon
            src={`${CATALOG_API_BASE}/portfolio_items/${product.id}/icon`}
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
              updatePortfolioItem({
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
  uploadIcon: PropTypes.func.isRequired
};

export default EditPortfolioItem;
