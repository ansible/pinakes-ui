import React from 'react';
import get from 'lodash/get';
import { DateFormat } from '@redhat-cloud-services/frontend-components/components/DateFormat';

import {
  PORTFOLIO_ITEM_NULLABLE,
  PORTFOLIO_NULLABLE
} from '../../constants/nullable-attributes';

export const scrollToTop = () =>
  document.getElementById('root').scrollTo({
    behavior: 'smooth',
    top: 0,
    left: 0
  });

export const filterServiceOffering = ({ display_name, name }, filter) => {
  const filterAtrribute = display_name || name;
  return filterAtrribute
    .trim()
    .toLowerCase()
    .includes(filter.toLowerCase());
};

export const allowNull = (wrappedPropTypes) => (props, propName, ...rest) => {
  if (props[propName] === null) {
    return null;
  }

  return wrappedPropTypes(props, propName, ...rest);
};

export const udefinedToNull = (entity, keys) =>
  [...Object.keys(entity), ...keys].reduce(
    (acc, curr) => ({
      ...acc,
      [curr]: entity[curr] === undefined ? null : entity[curr]
    }),
    {}
  );

const nullableMapper = {
  PortfolioItem: PORTFOLIO_ITEM_NULLABLE,
  Portfolio: PORTFOLIO_NULLABLE
};

export const sanitizeValues = (values, entityType, store) => {
  const schemas = store.getState().openApiReducer.schema.components.schemas;
  const permittedValues = Object.keys(values)
    .filter((key) => !get(schemas, `${entityType}.properties.${key}.readOnly`))
    .reduce(
      (acc, curr) => (values[curr] ? { ...acc, [curr]: values[curr] } : acc),
      {}
    );
  return udefinedToNull(permittedValues, nullableMapper[entityType]);
};

export const timeAgo = (date) => (
  <span key={date}>
    <DateFormat date={date} type="relative" />
  </span>
);

const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
export const readableBytes = (bytes) => {
  if (bytes === 0) {
    return 'O B';
  }

  const i = Math.floor(Math.log(bytes) / Math.log(1024));

  return (bytes / Math.pow(1024, i)).toFixed(2) * 1 + ' ' + sizes[i];
};

export const hasPermission = (userPermissions = [], permissions = []) =>
  permissions.every((permission) =>
    userPermissions.find((item) => item.permission === permission)
  );
