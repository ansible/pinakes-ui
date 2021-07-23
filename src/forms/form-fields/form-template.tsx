/* eslint-disable react/prop-types */
import React, { ReactNode, Fragment } from 'react';
import styled from 'styled-components';
import ReactDOM from 'react-dom';
import PF4FormTemplate from '@data-driven-forms/pf4-component-mapper/form-template/form-template';
import Pf4FormTemplateProps from '@data-driven-forms/react-form-renderer/common-types/form-template-render-props';
import useFormApi from '@data-driven-forms/react-form-renderer/use-form-api';
import Schema from '@data-driven-forms/react-form-renderer/common-types/schema';
import FormSpy from '@data-driven-forms/react-form-renderer/form-spy';
import {
  ModalProps,
  Spinner,
  ModalBoxHeader,
  ModalBoxCloseButton,
  ModalBoxBody,
  ModalBoxFooter,
  Backdrop,
  FocusTrap,
  ModalVariant,
  Button
} from '@patternfly/react-core';

import SpinnerWrapper from '../../presentational-components/styled-components/spinner-wrapper';
import useFormatMessage from '../../utilities/use-format-message';
/**Make sure we have styles loaded */
import '@patternfly/react-styles/css/components/ModalBox/modal-box.css';
import labelMessages from '../../messages/labels.messages';

const StyledForm = styled(({ variant, ...props }) => <form {...props} />)`
  max-width: calc(100% - 32px);
  width: ${({ variant }: { variant: ModalVariant }) =>
    variant === 'small' ? '560px' : '100%'};
  max-height: calc(100% - 48px);
`;

export interface InternalModalProps
  extends Omit<Omit<ModalProps, 'ref'>, 'children'> {
  isLoading?: boolean;
}

interface ModalFormTemplateProps {
  schema: Schema;
  submitLabel?: ReactNode;
  formFields: ReactNode[];
  modalProps: Partial<InternalModalProps>;
}

const ModalFormTemplate: React.ComponentType<ModalFormTemplateProps> = ({
  schema,
  formFields,
  submitLabel,
  modalProps: { isLoading, title, description, onClose, variant }
}) => {
  const { handleSubmit } = useFormApi();
  const formatMessage = useFormatMessage();
  return ReactDOM.createPortal(
    <div>
      <Backdrop>
        <FocusTrap className="pf-l-bullseye">
          <StyledForm
            onSubmit={isLoading ? () => undefined : handleSubmit}
            variant={variant}
            className="pf-c-modal-box pf-m-sm"
          >
            <ModalBoxCloseButton onClose={onClose} />
            <ModalBoxHeader>
              <h1 id="modal-form-title" className="pf-c-modal-box__title">
                {title}
              </h1>
              {description && (
                <div
                  id="modal-form-description"
                  className="pf-c-modal-box__description"
                >
                  {description}
                </div>
              )}
            </ModalBoxHeader>
            <ModalBoxBody>
              <div>
                <div className="pf-c-form">
                  {isLoading ? (
                    <SpinnerWrapper className="pf-u-m-md">
                      <Spinner />
                    </SpinnerWrapper>
                  ) : (
                    <Fragment>
                      {schema.title}
                      {formFields}
                    </Fragment>
                  )}
                </div>
              </div>
            </ModalBoxBody>
            <ModalBoxFooter>
              <FormSpy
                subscription={{
                  invalid: true,
                  validating: true,
                  pristine: true,
                  submitting: true
                }}
              >
                {({ pristine, invalid, validating, submitting }) => (
                  <Fragment>
                    <Button
                      type="submit"
                      isDisabled={
                        pristine || invalid || validating || submitting
                      }
                    >
                      {submitLabel || formatMessage(labelMessages.save)}
                    </Button>
                    <Button variant="link" onClick={onClose}>
                      {formatMessage(labelMessages.cancel)}
                    </Button>
                  </Fragment>
                )}
              </FormSpy>
            </ModalBoxFooter>
          </StyledForm>
        </FocusTrap>
      </Backdrop>
    </div>,
    document.body
  );
};

export interface FormTemplateProps extends Pf4FormTemplateProps {
  isModal?: boolean;
  modalProps?: InternalModalProps;
  submitlabel?: ReactNode;
}

const FormTemplate: React.ComponentType<FormTemplateProps> = ({
  isModal,
  modalProps = {},
  ...props
}) => {
  if (isModal) {
    return <ModalFormTemplate {...props} modalProps={modalProps} />;
  }

  return <PF4FormTemplate {...props} />;
};

export default FormTemplate;
