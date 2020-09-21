/* eslint-disable react/prop-types */
import React, { memo } from 'react';
import ReactFormRender, {
  FormRendererProps as DDFFormRendererProps
} from '@data-driven-forms/react-form-renderer/dist/cjs/form-renderer';
import validatorMapper from '@data-driven-forms/react-form-renderer/dist/cjs/validator-mapper';
import TextField from '@data-driven-forms/pf4-component-mapper/dist/cjs/text-field';
import Textarea from '@data-driven-forms/pf4-component-mapper/dist/cjs/textarea';
import SubForm from '@data-driven-forms/pf4-component-mapper/dist/cjs/sub-form';
import PlainText from '@data-driven-forms/pf4-component-mapper/dist/cjs/plain-text';
import Checkbox from '@data-driven-forms/pf4-component-mapper/dist/cjs/checkbox';
import Radio from '@data-driven-forms/pf4-component-mapper/dist/cjs/radio';
import Switch from '@data-driven-forms/pf4-component-mapper/dist/cjs/switch';

import Pf4SelectWrapper from '../../presentational-components/shared/pf4-select-wrapper';
import ShareGroupSelect from '../../forms/form-fields/share-group-select';
import ShareGroupEdit from '../../forms/form-fields/share-group-edit';
import componentTypes from '@data-driven-forms/react-form-renderer/dist/cjs/component-types';
import validatorTypes from '@data-driven-forms/react-form-renderer/dist/cjs/validator-types';
import translateSchema from '../../utilities/translate-schema';
import Select from '@data-driven-forms/pf4-component-mapper/dist/cjs/select';
import CopyNameDisplay from '../../forms/form-fields/copy-name-display';
import InitialChips from '../../forms/form-fields/initial-chips';
import useFormatMessage from '../../utilities/use-format-message';
import FormTemplate, {
  FormTemplateProps,
  InternalModalProps
} from '../../forms/form-fields/form-template';
import {
  ComponentMapper,
  Schema
} from '@data-driven-forms/react-form-renderer';

export const catalogComponentMapper: ComponentMapper = {
  [componentTypes.TEXT_FIELD]: TextField,
  [componentTypes.TEXTAREA]: Textarea,
  [componentTypes.PLAIN_TEXT]: PlainText,
  [componentTypes.SELECT]: Pf4SelectWrapper,
  [componentTypes.CHECKBOX]: Checkbox,
  [componentTypes.RADIO]: Radio,
  [componentTypes.SWITCH]: Switch,
  [componentTypes.SUB_FORM]: SubForm,
  'initial-select': Select,
  'share-group-select': ShareGroupSelect,
  'share-group-edit': ShareGroupEdit,
  'copy-name-display': CopyNameDisplay,
  'textarea-field': Textarea,
  'select-field': Pf4SelectWrapper,
  'initial-chips': InitialChips
};

const catalogValidatorMapper = {
  ...validatorMapper,
  'exact-length-validator': validatorMapper[validatorTypes.EXACT_LENGTH],
  'max-length-validator': validatorMapper[validatorTypes.MAX_LENGTH],
  'min-items-validator': validatorMapper[validatorTypes.MIN_ITEMS],
  'min-length-validator': validatorMapper[validatorTypes.MIN_LENGTH],
  'pattern-validator': validatorMapper[validatorTypes.PATTERN],
  'required-validator': validatorMapper[validatorTypes.REQUIRED],
  'url-validator': validatorMapper[validatorTypes.URL]
};

export const catalogValidatorAlias = {
  'exact-length-validator': validatorTypes.EXACT_LENGTH,
  'max-length-validator': validatorTypes.MAX_LENGTH,
  'min-items-validator': validatorTypes.MIN_ITEMS,
  'min-length-validator': validatorTypes.MIN_LENGTH,
  'pattern-validator': validatorTypes.PATTERN,
  'required-validator': validatorTypes.REQUIRED,
  'url-validator': validatorTypes.URL
};

export interface FormRendererProps extends Partial<DDFFormRendererProps> {
  isModal?: boolean;
  templateProps?: Omit<FormTemplateProps, 'modalProps'>;
  schema: Schema;
  modalProps?: InternalModalProps;
  onSubmit: (...args: any[]) => any;
}

const FormRenderer: React.ComponentType<FormRendererProps> = ({
  isModal,
  templateProps = {},
  schema,
  modalProps,
  ...rest
}) => {
  const formatMessage = useFormatMessage();
  return (
    <div>
      <ReactFormRender
        componentMapper={catalogComponentMapper}
        FormTemplate={(props) => (
          <FormTemplate
            {...props}
            {...templateProps}
            modalProps={modalProps}
            isModal={isModal}
          />
        )}
        validatorMapper={catalogValidatorMapper}
        schema={translateSchema(schema, formatMessage)}
        {...rest}
      />
    </div>
  );
};

export default memo(FormRenderer);
