import componentTypes from '@data-driven-forms/react-form-renderer/dist/cjs/component-types';
import { FieldApi } from '@data-driven-forms/react-form-renderer/dist/cjs/field';
import { FormOptions } from '@data-driven-forms/react-form-renderer/dist/cjs/renderer-context';
import Schema from '@data-driven-forms/react-form-renderer/dist/cjs/schema';
import asyncFormValidator from '../utilities/async-form-validator';
import { LoadOptions, AnyObject } from '../types/common-types';
import { ReactNode } from 'react';

type ResolveNewProcessProps = (
  props: AnyObject,
  fieldApi: FieldApi<{ id: string }[]>,
  formOptions: FormOptions
) => {
  key: number;
  loadOptions: LoadOptions;
};
const resolveNewProcessProps: ResolveNewProcessProps = (
  props,
  _fieldApi,
  formOptions
) => {
  const initialProcessess: { id: string }[] = formOptions.getState().values[
    'initial-tags'
  ];
  return {
    key: initialProcessess.length, // used to trigger options re-load and disable options update
    loadOptions: (...args) =>
      (props as { loadOptions: LoadOptions })
        .loadOptions(...args)
        .then((data) =>
          data.map((option) => ({
            ...option,
            ...(initialProcessess.find(({ id }) => id === option.value) // we have to disable options that are already in the chip group
              ? { isDisabled: true }
              : {})
          }))
        )
  };
};

const createSchema = (
  existingTagsMessage: ReactNode,
  loadTags: LoadOptions
): Schema => ({
  fields: [
    {
      component: componentTypes.SELECT,
      name: 'new-tags',
      label: '',
      loadOptions: asyncFormValidator(loadTags),
      multi: true,
      isSearchable: true,
      isClearable: true,
      resolveProps: resolveNewProcessProps
    },
    {
      component: 'initial-chips',
      name: 'initial-tags',
      label: existingTagsMessage
    }
  ]
});

export default createSchema;
