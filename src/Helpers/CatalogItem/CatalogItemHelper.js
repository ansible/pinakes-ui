import React from 'react';
import CatalogItemShow from 'PresentationalComponents/CatalogItems/CatalogItemShow';


const InsightsHsdmApi = require('../../../insights_hsdm_api');
const defaultClient = InsightsHsdmApi.ApiClient.instance;
// Configure HTTP basic authorization: UserSecurity
const UserSecurity = defaultClient.authentications['UserSecurity'];

const api = new InsightsHsdmApi.UsersApi();

export function getCatalogItems(apiProps) {
    //return processCatalogItems(loadDemoCatalogItems);
    return api.catalogItems().then((data) => {
        console.log('API called successfully. Returned data: ' + data);
        return processCatalogItems(data);

    }, (error) => {
        console.error(error);
    });

}

export function getCatalogItem(catalogId) {
    // TODO - use the API call to retrieve a single catalog item - when it is implemented
    return api.catalogItems().then((data) => {
        console.log('API called successfully. Returned data: ' + data);
        return retrieveSingleItem(data, catalogId);
    }, (error) => {
        console.error(error);
    });

}

function processCatalogItems(catItems) {
    let catalogItems = [];
    catItems.forEach( function(item, row, _array) {
        let newRow = processCatalogItemRow(row, item);
        catalogItems.push(newRow);
    });

    let page = 1;
    let pageSize = 20;
    let pages = catItems.length%20 + 1;
    return {
        catalogItems,
        page,
        pageSize,
        pages
    };
}

function retrieveSingleItem(catItems, id) {
    let cItem = catItems.find(item => {return item.catalog_id === id;});
    console.log('RetrieveSingleItem: ');
    console.log(cItem);
    return {catalogItem: cItem};
}

function processCatalogItemRow(key, data) {
    let modifiedData = {
        ...data,
        catalog_id: <b>{data.catalog_id}</b>,
    };
    return <CatalogItemShow key={data.catalog_id} {...data} />;
}


