import React from 'react';
import { connect } from 'react-redux';
import { Modal,
  ModalBoxHeader,
  ModalBoxBody,
  ModalBoxCloseButton
} from '@patternfly/react-core';

import { default as modalTypes } from './ModalTypes';

// why ???
const MODAL_TYPES = {
  order: modalTypes.orderModal,
  addportfolio: modalTypes.addPortfolioModal,
  editportfolio: modalTypes.editPortfolioModal
};

const mapStateToProps = state => ({
  ...state.MainModalStore
});

class MainModalContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalIsOpen: false
    };
    // transform class properties
    this.closeModal = this.closeModal.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps !== this.props) {
      this.setState({
        modalIsOpen: nextProps.modalProps.open
      });
    }
  }

  closeModal() {
    this.setState({ modalIsOpen: false });
    this.props.modalProps.closeModal();
  }

  render() {
    if (!this.props.modalType) {
      // why? this should fail, should be required props oneOf
      return null;
    }

    const SpecifiedModal = MODAL_TYPES[this.props.modalType];
    return (
      <div>
        <Modal isOpen={ this.props.modalProps.open } id='mainModal' title={ '' } className="modal-dialog modal-lg" onClose={ this.closeModal }>
          <ModalBoxHeader>
            <ModalBoxCloseButton onClose={ this.closeModal }/>
          </ModalBoxHeader>
          <ModalBoxBody id='modalBody'>
            <SpecifiedModal
              closeModal={ this.closeModal }
              { ...this.props.modalProps }
            />
          </ModalBoxBody>
        </Modal>
      </div>
    );
  }
}

export default connect(mapStateToProps)(MainModalContainer);
