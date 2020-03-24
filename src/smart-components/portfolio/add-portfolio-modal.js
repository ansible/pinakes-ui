import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Modal } from '@patternfly/react-core';
import { Spinner } from '@patternfly/react-core/dist/js/components/Spinner/Spinner';

import FormRenderer from '../common/form-renderer';
import { createPortfolioSchema } from '../../forms/portfolio-form.schema';
import {
  addPortfolio,
  updatePortfolio
} from '../../redux/actions/portfolio-actions';
import useQuery from '../../utilities/use-query';
import { getPortfolioFromState } from '../../helpers/portfolio/portfolio-helper';
import useEnhancedHistory from '../../utilities/use-enhanced-history';
import SpinnerWrapper from '../../presentational-components/styled-components/spinner-wrapper';
import { UnauthorizedRedirect } from '../error-pages/error-redirects';

const AddPortfolioModal = ({ removeQuery, closeTarget }) => {
  const dispatch = useDispatch();
  const [{ portfolio: portfolioId }] = useQuery(['portfolio']);
  const { push } = useEnhancedHistory(removeQuery);
  const initialValues = useSelector(({ portfolioReducer }) =>
    getPortfolioFromState(portfolioReducer, portfolioId)
  );
  const onSubmit = (data) => {
    push(closeTarget);
    return initialValues
      ? dispatch(updatePortfolio(data))
      : dispatch(addPortfolio(data));
  };

  const editVariant =
    portfolioId && initialValues && Object.keys(initialValues).length > 0;

  if (initialValues?.metadata?.user_capabilities?.update === false) {
    return <UnauthorizedRedirect />;
  }

  return (
    <Modal
      title={portfolioId ? 'Edit portfolio' : 'Create portfolio'}
      isOpen
      onClose={() => push(closeTarget)}
      isSmall
    >
      {!portfolioId || editVariant ? (
        <FormRenderer
          schema={createPortfolioSchema(!initialValues, portfolioId)}
          schemaType="default"
          onSubmit={onSubmit}
          onCancel={() => push(closeTarget)}
          initialValues={{ ...initialValues }}
          formContainer="modal"
          buttonsLabels={{ submitLabel: portfolioId ? 'Save' : 'Create' }}
        />
      ) : (
        <SpinnerWrapper className="pf-u-m-md">
          <Spinner />
        </SpinnerWrapper>
      )}
    </Modal>
  );
};

AddPortfolioModal.propTypes = {
  removeQuery: PropTypes.bool,
  closeTarget: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      pathname: PropTypes.string.isRequired,
      search: PropTypes.string
    })
  ]).isRequired
};

export default AddPortfolioModal;
