import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { useLocation, useHistory } from 'react-router-dom';

import FormRenderer from '../../common/form-renderer';
import {
  editPortfolioItemSchema,
  editPortfolioItemSchemaS
} from '../../../forms/edit-portfolio-item-form.schema';
import { updatePortfolioItem } from '../../../redux/actions/portfolio-actions';
import { updatePortfolioItem as updatePortfolioItemS } from '../../../redux/actions/portfolio-actions-s';
import { Stack, StackItem } from '@patternfly/react-core';
import IconUpload from './icon-upload';
import { CATALOG_API_BASE } from '../../../utilities/constants';
import CardIcon from '../../../presentational-components/shared/card-icon';
import { isStandalone } from '../../../helpers/shared/helpers';
import { getAxiosInstance } from '../../../helpers/shared/user-login';
import { SET_OPENAPI_SCHEMA } from '../../../redux/action-types';
import { getUser } from '../../../helpers/shared/active-user';

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
  const icon_url = isStandalone() ? product.icon_url : product.icon_id;
  const icon_src = isStandalone()
    ? product.icon_url || 'default'
    : `${CATALOG_API_BASE}/portfolio_items/${
        product.id
      }/icon?cache_id=${product.icon_id || 'default'}`;

  useEffect(() => {
    getAxiosInstance()
      .get(`${CATALOG_API_BASE}/schema/openapi.json`)
      .then((payload) => {
        dispatch({ type: SET_OPENAPI_SCHEMA, payload });
      });
  }, []);

  return (
    <Stack hasGutter>
      <StackItem key={icon_url || 'default'}>
        <IconUpload
          uploadIcon={uploadIcon}
          resetIcon={resetIcon}
          enableReset={!!icon_url}
        >
          <CardIcon
            src={icon_src} // we need ho add the query to prevent the browser caching when resetting the image
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
              isStandalone()
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
          schema={
            isStandalone() ? editPortfolioItemSchemaS : editPortfolioItemSchema
          }
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
