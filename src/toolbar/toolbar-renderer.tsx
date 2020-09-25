/* eslint-disable react/prop-types */
import React, { createContext, ReactNode } from 'react';
import toolbarMapper, { toolbarComponentTypes } from './toolbar-mapper';
import { AnyObject, ValueOf } from '../types/common-types';

export interface ToolbarField extends AnyObject {
  component:
    | ValueOf<typeof toolbarMapper>
    | React.ComponentType
    | ValueOf<typeof toolbarComponentTypes>;
  hidden?: boolean;
  fields?: ToolbarField[];
  key: string;
}

export interface ToolbarSchema {
  fields: ToolbarField[];
}

const ToolbarContext = createContext<{
  render?: (fields: ToolbarField[]) => ReactNode;
  componentMapper?: typeof toolbarMapper;
}>({});

interface ComponentProps extends AnyObject {
  component:
    | ValueOf<typeof toolbarMapper>
    | React.ComponentType
    | ValueOf<typeof toolbarComponentTypes>;
}
const Component: React.ComponentType<ComponentProps> = ({
  component,
  ...props
}) => (
  <ToolbarContext.Consumer>
    {({ componentMapper }) => {
      const C =
        typeof component === 'string'
          ? componentMapper &&
            componentMapper[component as keyof typeof toolbarMapper]
          : (component as React.ComponentType<any>);
      return C ? <C {...props} /> : null;
    }}
  </ToolbarContext.Consumer>
);

const render = (fields: ToolbarField[]): React.ReactNode =>
  fields.map(({ hidden, fields, key, ...field }) =>
    hidden ? null : fields ? (
      <Component key={key} {...field}>
        {render(fields)}
      </Component>
    ) : (
      <Component key={key} {...field} />
    )
  );

export interface ToolbarRendererProps {
  schema: ToolbarSchema;
  componentMapper?: typeof toolbarMapper;
}
const ToolbarRenderer: React.ComponentType<ToolbarRendererProps> = ({
  schema,
  componentMapper = toolbarMapper
}) => (
  <ToolbarContext.Provider value={{ render, componentMapper }}>
    {render(schema.fields)}
  </ToolbarContext.Provider>
);

export default ToolbarRenderer;
