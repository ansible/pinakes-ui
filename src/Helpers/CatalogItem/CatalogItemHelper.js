import React from 'react';
import _ from "lodash";
import { loadDemoCatalogItems } from 'demoData/catalogitems';
import CatalogItemShow from 'PresentationalComponents/CatalogItems/CatalogItemShow';

/*eslint camelcase: ["error", {properties: "never"}]*/

var InsightsHsdmApi = require('../../../insights_hsdm_api');

var defaultClient = InsightsHsdmApi.ApiClient.instance;

// Configure HTTP basic authorization: UserSecurity
var UserSecurity = defaultClient.authentications['UserSecurity'];

// UserSecurity.apiKey = 'eyJUb2tlblR5cGUiOiJBUEkiLCJzYWx0IjoiNTU2NjZiN2EtMmZkZS00YzAzLWFkZjgtMjRiM2RlZGMxN2VlIiwiYWxnIjoiSFM1MTIifQ.eyJqdGkiOiIxYWRlMmU2NS0zMjZkLTRjNmEtYTY1ZS0zZWQ2YmRlNjA4MzUiLCJpYXQiOjE1MzA0NTQwMDV9.E8Fpj4z_5_I_tBWWbSOf3yHKFa98HPOg073nBeLxYGVr2D42zcIktHVVYZcBghZR8HWvLgwZfuUXoKtDdUuw8w'

UserSecurity.username = 'admin';
UserSecurity.password = 'smartvm';

var api = new InsightsHsdmApi.UsersApi();

//api.catalogItems( function(error, data, response) {
//    console.log('API called successfully. Returned data: ' + data);
//}, function(error) {
//    console.error(error);
//});
api.catalogItems().then((data) => {
    console.log('API called successfully. Returned data: ' + data);
}, (error) => {
    console.error(error);
});


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
    return <CatalogItemShow key={data.catalog_id} {...modifiedData} />;
}


