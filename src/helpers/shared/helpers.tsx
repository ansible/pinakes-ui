/* eslint-disable react/prop-types */
/**
 * No prop types in TSX files are needed.
 * Props are defined via interface
 */
import React from 'react';
import { Store } from 'redux';
import get from 'lodash/get';
import { DateFormat } from '@redhat-cloud-services/frontend-components/DateFormat';

import {
  PORTFOLIO_ITEM_NULLABLE,
  PORTFOLIO_NULLABLE
} from '../../constants/nullable-attributes';
import { AnyObject, StringObject } from '../../types/common-types';

export const scrollToTop = (): void =>
  document.getElementById('root')?.scrollTo({
    behavior: 'smooth',
    top: 0,
    left: 0
  });

export const filterServiceOffering = (
  { display_name, name }: { display_name?: string; name: string },
  filter: string
): boolean => {
  const filterAtrribute = display_name || name;
  return filterAtrribute
    .trim()
    .toLowerCase()
    .includes(filter.toLowerCase());
};

export const udefinedToNull = (entity: AnyObject, keys: string[]): AnyObject =>
  [...Object.keys(entity), ...keys].reduce(
    (acc, curr) => ({
      ...acc,
      [curr]: entity[curr] === undefined ? null : entity[curr]
    }),
    {}
  );

interface NullableMapper extends AnyObject {
  PortfolioItem: string[];
  Portfolio: string[];
}

const nullableMapper: NullableMapper = {
  PortfolioItem: PORTFOLIO_ITEM_NULLABLE,
  Portfolio: PORTFOLIO_NULLABLE
};

export const sanitizeValues = (
  values: AnyObject,
  entityType: string,
  store: Partial<Store>
): AnyObject => {
  const schemas = store.getState!().openApiReducer.schema.components.schemas;
  const permittedValues = Object.keys(values)
    .filter((key) => !get(schemas, `${entityType}.properties.${key}.readOnly`))
    .reduce(
      (acc, curr) => (values[curr] ? { ...acc, [curr]: values[curr] } : acc),
      {}
    );
  return udefinedToNull(permittedValues, nullableMapper[entityType]);
};

export interface TimeAgoProps {
  date: Date | string | number;
}

export const TimeAgo: React.ComponentType<TimeAgoProps> = ({ date }) => (
  <span key={`${date}`}>
    <DateFormat date={date} type="relative" />
  </span>
);

const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
export const readableBytes = (bytes: number): string => {
  if (bytes === 0) {
    return 'O B';
  }

  const i: number = Math.floor(Math.log(bytes) / Math.log(1024));

  return `${Number((bytes / Math.pow(1024, i)).toFixed(2)) * 1} ${sizes[i]}`;
};

export const hasPermission = (
  userPermissions: StringObject[] = [],
  permissions: string[] = []
): boolean =>
  permissions.every((permission) =>
    userPermissions.find((item) => item.permission === permission)
  );

export const stateToDisplay = (state?: string): boolean =>
  state !== 'Completed' && state !== 'Ordered' && state !== 'Failed';

export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
