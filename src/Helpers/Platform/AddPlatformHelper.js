import React from 'react';
import { getUserApi } from '../Shared/userLogin';
import { consoleLog } from '../../Helpers/Shared/Helper';

const api = getUserApi();

export function addPlatform(providerData) {
    return api.addProvider(providerData).then((data) => {
        consoleLog('Add provider API called successfully. Returned data: ' + data);
        return data;
    }, (error) => {
        window.console.error(error);
    });
}
