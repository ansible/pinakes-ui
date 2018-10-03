import React from 'react';
import { getUserApi } from '../Shared/userLogin';

const api = getUserApi();

export function addPlatform(providerData) {
  return api.addProvider(providerData).then((data) => {
    console.log('Add provider API called successfully. Returned data: ' + data);
    return data;
  }, (error) => {
    console.error(error);
  });
}
