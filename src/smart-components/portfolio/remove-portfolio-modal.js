import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { WarningTriangleIcon } from '@patternfly/react-icons';
import {
  Modal,
  Button,
  Text,
  TextVariants,
  TextContent,
  Split,
  SplitItem
} from '@patternfly/react-core';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications';
import { removePortfolio } from '../../redux/actions/portfolio-actions';

const RemovePortfolioModal = ({
  history: { goBack, push },
  removePortfolio,
  portfolio
}) => {
  const onSubmit = () => {
    push('/portfolios');
    return removePortfolio(portfolio.id);
  };

  const onCancel = () => goBack();

  if (!portfolio) {
    return null;
  }

  return (
    <Modal
      title="Delete Portfolio?"
      isOpen
      isSmall
      onClose={onCancel}
      isFooterLeftAligned
      actions={[
        <Button key="submit" variant="danger" type="button" onClick={onSubmit}>
          Confirm
        </Button>,
        <Button key="cancel" variant="link" type="button" onClick={onCancel}>
          Cancel
        </Button>
      ]}
    >
      <Split gutter="md">
        <SplitItem>
          <WarningTriangleIcon size="xl" fill="#f0ab00" />
        </SplitItem>
        <SplitItem>
          <TextContent>
            <Text component={TextVariants.p}>
              This action will permanently delete portfolio {portfolio.name} and
              its data.
            </Text>
          </TextContent>
        </SplitItem>
      </Split>
    </Modal>
  );
};

RemovePortfolioModal.propTypes = {
  history: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired
  }).isRequired,
  removePortfolio: PropTypes.func.isRequired,
  addNotification: PropTypes.func.isRequired,
  portfolio: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
  })
};

const portfolioDetailsFromState = (state, id) =>
  state.portfolioReducer.portfolios.data.find(
    (portfolio) => portfolio.id === id
  );

const mapStateToProps = (
  state,
  {
    match: {
      params: { id }
    }
  }
) => ({ portfolio: portfolioDetailsFromState(state, id) });

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      addNotification,
      removePortfolio
    },
    dispatch
  );

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(RemovePortfolioModal)
);
