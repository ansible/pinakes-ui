import React from 'react';
import moment from 'moment';
import get from 'lodash/get';
import { DateFormat } from '@redhat-cloud-services/frontend-components';

import { PORTFOLIO_ITEM_NULLABLE, PORTFOLIO_NULLABLE } from '../../constants/nullable-attributes';

export const scrollToTop = () => document.getElementById('root').scrollTo({
  behavior: 'smooth',
  top: 0,
  left: 0
});

export const filterServiceOffering = ({ display_name, name }, filter) => {
  const filterAtrribute = display_name || name;
  return filterAtrribute.trim().toLowerCase().includes(filter.toLowerCase());
};

export const allowNull = wrappedPropTypes => (props, propName, ...rest) => {
  if (props[propName] === null) {
    return null;
  }

  return wrappedPropTypes(props, propName, ...rest);
};

const oneDay = 24 * 60 * 60 * 1000;
export const calcuateDiffDays = (firstDate, secondDate) => Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / (oneDay)));

export const createModifiedLabel = (date, user) => `Last modified ${calcuateDiffDays(new Date(), date)} days ago${ user ? ` by ${user}.` : '.'  }`;

export const createOrderedLabel = date => {
  const orderedAgo = calcuateDiffDays(date, new Date());
  return `Ordered ${orderedAgo} ${orderedAgo > 1 ? 'days' : 'day'} ago`;
};

export const createUpdatedLabel = orderItem => {
  if (!orderItem[0]) {
    return null;
  }

  const orderedAgo = calcuateDiffDays(new Date(orderItem[0].updated_at), new Date());
  return `Updated ${orderedAgo} ${orderedAgo > 1 ? 'days' : 'day'} ago`;
};

export const createDateString = date => moment(new Date(date).toUTCString(), 'DD-MMM-YYYY, HH:mm').format('DD MMM YYYY, HH:mm UTC');

export const udefinedToNull = (entity, keys) => [ ...Object.keys(entity), ...keys ].reduce((acc, curr) => ({
  ...acc,
  [curr]: entity[curr] === undefined ? null : entity[curr]
}), {});

const nullableMapper = {
  PortfolioItem: PORTFOLIO_ITEM_NULLABLE,
  Portfolio: PORTFOLIO_NULLABLE
};

export const sanitizeValues = (values, entityType, store) => {
  const schemas = store.getState().openApiReducer.schema.components.schemas;
  const permittedValues = Object.keys(values)
  .filter(key => !get(schemas, `${entityType}.properties.${key}.readOnly`))
  .reduce((acc, curr) => values[curr]
    ? ({ ...acc, [curr]: values[curr] })
    : acc,
  {});
  return udefinedToNull(permittedValues, nullableMapper[entityType]);
};

export const timeAgo = (date) => DateFormat ?
  <span><DateFormat date={ date } type="relative"/></span>
  :  moment(date).fromNow();
