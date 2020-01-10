import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import { Bullseye, Modal } from '@patternfly/react-core';
import { Spinner } from '@redhat-cloud-services/frontend-components';

import FormRenderer from '../common/form-renderer';
import { createPortfolioSchema } from '../../forms/portfolio-form.schema';
import {
  addPortfolio,
  updatePortfolio
} from '../../redux/actions/portfolio-actions';

const AddPortfolioModal = ({
  history: { goBack },
  match: {
    params: { id }
  },
  addPortfolio,
  initialValues,
  updatePortfolio
}) => {
  const onSubmit = (data) => {
    goBack();
    return initialValues ? updatePortfolio(data) : addPortfolio(data);
  };

  const onCancel = () => goBack();

  return (
    <Modal
      title={initialValues ? 'Edit portfolio' : 'Create portfolio'}
      isOpen
      onClose={onCancel}
      isSmall
    >
      {!id || (id && initialValues) ? (
        <div style={{ padding: 8 }}>
          <FormRenderer
            schema={createPortfolioSchema(!initialValues, id)}
            schemaType="default"
            onSubmit={onSubmit}
            onCancel={onCancel}
            initialValues={{ ...initialValues }}
            formContainer="modal"
            buttonsLabels={{ submitLabel: id ? 'Save' : 'Create' }}
          />
        </div>
      ) : (
        <Bullseye>
          <div className="pf-u-m-md">
            <Spinner />
          </div>
        </Bullseye>
      )}
    </Modal>
  );
};

AddPortfolioModal.propTypes = {
  history: PropTypes.shape({
    goBack: PropTypes.func.isRequired
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string
    }).isRequired
  }).isRequired,
  addPortfolio: PropTypes.func.isRequired,
  initialValues: PropTypes.object,
  updatePortfolio: PropTypes.func.isRequired
};

const stripValues = ({ owner, created_at, updated_at, ...rest }) => rest;

const mapStateToProps = (
  { portfolioReducer: { portfolios } },
  {
    match: {
      params: { id }
    }
  }
) => ({
  initialValues:
    id &&
    (() => {
      const portfolio = portfolios.data.find((item) => item.id === id);
      return portfolio && stripValues(portfolio);
    })(),
  portfolioId: id
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      addPortfolio,
      updatePortfolio
    },
    dispatch
  );

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(AddPortfolioModal)
);
