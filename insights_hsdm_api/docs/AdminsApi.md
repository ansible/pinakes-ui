# InsightsServiceCatalogApi.AdminsApi

All URIs are relative to *https://virtserver.swaggerhub.com/r/insights/platform/service-portal/1.0.0*

Method | HTTP request | Description
------------- | ------------- | -------------
[**addPortfolio**](AdminsApi.md#addPortfolio) | **POST** /portfolios | API to add a new portfolio
[**addPortfolioItem**](AdminsApi.md#addPortfolioItem) | **POST** /portfolio_items | API to add a new portfolio item
[**addPortfolioItemToPortfolio**](AdminsApi.md#addPortfolioItemToPortfolio) | **POST** /portfolios/{portfolio_id}/portfolio_items/{portfolio_item_id} | Add Portfolio item to a portfolio
[**fetchPortfolioItemFromPortfolio**](AdminsApi.md#fetchPortfolioItemFromPortfolio) | **GET** /portfolios/{portfolio_id}/portfolio_items/{portfolio_item_id} | Fetch a portfolio item from a specific portfolio
[**fetchPortfolioItemsWithPortfolio**](AdminsApi.md#fetchPortfolioItemsWithPortfolio) | **GET** /portfolios/{portfolio_id}/portfolio_items | Fetch all portfolio items from a specific portfolio
[**fetchPortfolioWithId**](AdminsApi.md#fetchPortfolioWithId) | **GET** /portfolios/{portfolio_id} | Fetch a specific Portfolio
[**listPortfolioItems**](AdminsApi.md#listPortfolioItems) | **GET** /portfolio_items | API to list portfolio_items
[**listPortfolios**](AdminsApi.md#listPortfolios) | **GET** /portfolios | API to list portfolios


<a name="addPortfolio"></a>
# **addPortfolio**
> Object addPortfolio(body)

API to add a new portfolio

Returns the added portfolio object 

### Example
```javascript
import InsightsServiceCatalogApi from 'insights_service_catalog_api';
let defaultClient = InsightsServiceCatalogApi.ApiClient.instance;

// Configure HTTP basic authorization: AdminSecurity
let AdminSecurity = defaultClient.authentications['AdminSecurity'];
AdminSecurity.username = 'YOUR USERNAME';
AdminSecurity.password = 'YOUR PASSWORD';

// Configure HTTP basic authorization: UserSecurity
let UserSecurity = defaultClient.authentications['UserSecurity'];
UserSecurity.username = 'YOUR USERNAME';
UserSecurity.password = 'YOUR PASSWORD';

let apiInstance = new InsightsServiceCatalogApi.AdminsApi();

let body = new InsightsServiceCatalogApi.Portfolio(); // Portfolio | 

apiInstance.addPortfolio(body).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | [**Portfolio**](Portfolio.md)|  | 

### Return type

**Object**

### Authorization

[AdminSecurity](../README.md#AdminSecurity), [UserSecurity](../README.md#UserSecurity)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="addPortfolioItem"></a>
# **addPortfolioItem**
> Object addPortfolioItem(body)

API to add a new portfolio item

Returns the added portfolio item object 

### Example
```javascript
import InsightsServiceCatalogApi from 'insights_service_catalog_api';
let defaultClient = InsightsServiceCatalogApi.ApiClient.instance;

// Configure HTTP basic authorization: AdminSecurity
let AdminSecurity = defaultClient.authentications['AdminSecurity'];
AdminSecurity.username = 'YOUR USERNAME';
AdminSecurity.password = 'YOUR PASSWORD';

// Configure HTTP basic authorization: UserSecurity
let UserSecurity = defaultClient.authentications['UserSecurity'];
UserSecurity.username = 'YOUR USERNAME';
UserSecurity.password = 'YOUR PASSWORD';

let apiInstance = new InsightsServiceCatalogApi.AdminsApi();

let body = new InsightsServiceCatalogApi.PortfolioItem(); // PortfolioItem | 

apiInstance.addPortfolioItem(body).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | [**PortfolioItem**](PortfolioItem.md)|  | 

### Return type

**Object**

### Authorization

[AdminSecurity](../README.md#AdminSecurity), [UserSecurity](../README.md#UserSecurity)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="addPortfolioItemToPortfolio"></a>
# **addPortfolioItemToPortfolio**
> addPortfolioItemToPortfolio(portfolioId, portfolioItemId, item)

Add Portfolio item to a portfolio

Add new portfolio item to an existing portfolio 

### Example
```javascript
import InsightsServiceCatalogApi from 'insights_service_catalog_api';
let defaultClient = InsightsServiceCatalogApi.ApiClient.instance;

// Configure HTTP basic authorization: AdminSecurity
let AdminSecurity = defaultClient.authentications['AdminSecurity'];
AdminSecurity.username = 'YOUR USERNAME';
AdminSecurity.password = 'YOUR PASSWORD';

// Configure HTTP basic authorization: UserSecurity
let UserSecurity = defaultClient.authentications['UserSecurity'];
UserSecurity.username = 'YOUR USERNAME';
UserSecurity.password = 'YOUR PASSWORD';

let apiInstance = new InsightsServiceCatalogApi.AdminsApi();

let portfolioId = 56; // Number | The Portfolio ID

let portfolioItemId = 56; // Number | The Portfolio Item ID

let item = new InsightsServiceCatalogApi.PortfolioItem(); // PortfolioItem | 

apiInstance.addPortfolioItemToPortfolio(portfolioId, portfolioItemId, item).then(() => {
  console.log('API called successfully.');
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **portfolioId** | **Number**| The Portfolio ID | 
 **portfolioItemId** | **Number**| The Portfolio Item ID | 
 **item** | [**PortfolioItem**](PortfolioItem.md)|  | 

### Return type

null (empty response body)

### Authorization

[AdminSecurity](../README.md#AdminSecurity), [UserSecurity](../README.md#UserSecurity)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="fetchPortfolioItemFromPortfolio"></a>
# **fetchPortfolioItemFromPortfolio**
> [PortfolioItem] fetchPortfolioItemFromPortfolio(portfolioId, portfolioItemId, )

Fetch a portfolio item from a specific portfolio

By passing in the portfolio id and portfolio_item_id you can fetch the portfolio items in the portfolio. 

### Example
```javascript
import InsightsServiceCatalogApi from 'insights_service_catalog_api';
let defaultClient = InsightsServiceCatalogApi.ApiClient.instance;

// Configure HTTP basic authorization: AdminSecurity
let AdminSecurity = defaultClient.authentications['AdminSecurity'];
AdminSecurity.username = 'YOUR USERNAME';
AdminSecurity.password = 'YOUR PASSWORD';

// Configure HTTP basic authorization: UserSecurity
let UserSecurity = defaultClient.authentications['UserSecurity'];
UserSecurity.username = 'YOUR USERNAME';
UserSecurity.password = 'YOUR PASSWORD';

let apiInstance = new InsightsServiceCatalogApi.AdminsApi();

let portfolioId = 56; // Number | The Portfolio ID

let portfolioItemId = 56; // Number | The Portfolio Item ID

apiInstance.fetchPortfolioItemFromPortfolio(portfolioId, portfolioItemId, ).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **portfolioId** | **Number**| The Portfolio ID | 
 **portfolioItemId** | **Number**| The Portfolio Item ID | 

### Return type

[**[PortfolioItem]**](PortfolioItem.md)

### Authorization

[AdminSecurity](../README.md#AdminSecurity), [UserSecurity](../README.md#UserSecurity)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="fetchPortfolioItemsWithPortfolio"></a>
# **fetchPortfolioItemsWithPortfolio**
> [PortfolioItem] fetchPortfolioItemsWithPortfolio(portfolioId, )

Fetch all portfolio items from a specific portfolio

By passing in the portfolio id you can fetch all the portfolio items in the portfolio. 

### Example
```javascript
import InsightsServiceCatalogApi from 'insights_service_catalog_api';
let defaultClient = InsightsServiceCatalogApi.ApiClient.instance;

// Configure HTTP basic authorization: AdminSecurity
let AdminSecurity = defaultClient.authentications['AdminSecurity'];
AdminSecurity.username = 'YOUR USERNAME';
AdminSecurity.password = 'YOUR PASSWORD';

// Configure HTTP basic authorization: UserSecurity
let UserSecurity = defaultClient.authentications['UserSecurity'];
UserSecurity.username = 'YOUR USERNAME';
UserSecurity.password = 'YOUR PASSWORD';

let apiInstance = new InsightsServiceCatalogApi.AdminsApi();

let portfolioId = 56; // Number | The Portfolio ID

apiInstance.fetchPortfolioItemsWithPortfolio(portfolioId, ).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **portfolioId** | **Number**| The Portfolio ID | 

### Return type

[**[PortfolioItem]**](PortfolioItem.md)

### Authorization

[AdminSecurity](../README.md#AdminSecurity), [UserSecurity](../README.md#UserSecurity)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="fetchPortfolioWithId"></a>
# **fetchPortfolioWithId**
> Portfolio fetchPortfolioWithId(portfolioId, )

Fetch a specific Portfolio

By passing in the portfolio id you can fetch a specific portfolio. 

### Example
```javascript
import InsightsServiceCatalogApi from 'insights_service_catalog_api';
let defaultClient = InsightsServiceCatalogApi.ApiClient.instance;

// Configure HTTP basic authorization: AdminSecurity
let AdminSecurity = defaultClient.authentications['AdminSecurity'];
AdminSecurity.username = 'YOUR USERNAME';
AdminSecurity.password = 'YOUR PASSWORD';

// Configure HTTP basic authorization: UserSecurity
let UserSecurity = defaultClient.authentications['UserSecurity'];
UserSecurity.username = 'YOUR USERNAME';
UserSecurity.password = 'YOUR PASSWORD';

let apiInstance = new InsightsServiceCatalogApi.AdminsApi();

let portfolioId = 56; // Number | The Portfolio ID

apiInstance.fetchPortfolioWithId(portfolioId, ).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **portfolioId** | **Number**| The Portfolio ID | 

### Return type

[**Portfolio**](Portfolio.md)

### Authorization

[AdminSecurity](../README.md#AdminSecurity), [UserSecurity](../README.md#UserSecurity)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="listPortfolioItems"></a>
# **listPortfolioItems**
> [PortfolioItem] listPortfolioItems()

API to list portfolio_items

Returns an array of portfolio item objects 

### Example
```javascript
import InsightsServiceCatalogApi from 'insights_service_catalog_api';
let defaultClient = InsightsServiceCatalogApi.ApiClient.instance;

// Configure HTTP basic authorization: AdminSecurity
let AdminSecurity = defaultClient.authentications['AdminSecurity'];
AdminSecurity.username = 'YOUR USERNAME';
AdminSecurity.password = 'YOUR PASSWORD';

// Configure HTTP basic authorization: UserSecurity
let UserSecurity = defaultClient.authentications['UserSecurity'];
UserSecurity.username = 'YOUR USERNAME';
UserSecurity.password = 'YOUR PASSWORD';

let apiInstance = new InsightsServiceCatalogApi.AdminsApi();
apiInstance.listPortfolioItems().then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters
This endpoint does not need any parameter.

### Return type

[**[PortfolioItem]**](PortfolioItem.md)

### Authorization

[AdminSecurity](../README.md#AdminSecurity), [UserSecurity](../README.md#UserSecurity)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="listPortfolios"></a>
# **listPortfolios**
> [Portfolio] listPortfolios()

API to list portfolios

Returns an array of portfolio objects 

### Example
```javascript
import InsightsServiceCatalogApi from 'insights_service_catalog_api';
let defaultClient = InsightsServiceCatalogApi.ApiClient.instance;

// Configure HTTP basic authorization: AdminSecurity
let AdminSecurity = defaultClient.authentications['AdminSecurity'];
AdminSecurity.username = 'YOUR USERNAME';
AdminSecurity.password = 'YOUR PASSWORD';

// Configure HTTP basic authorization: UserSecurity
let UserSecurity = defaultClient.authentications['UserSecurity'];
UserSecurity.username = 'YOUR USERNAME';
UserSecurity.password = 'YOUR PASSWORD';

let apiInstance = new InsightsServiceCatalogApi.AdminsApi();
apiInstance.listPortfolios().then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters
This endpoint does not need any parameter.

### Return type

[**[Portfolio]**](Portfolio.md)

### Authorization

[AdminSecurity](../README.md#AdminSecurity), [UserSecurity](../README.md#UserSecurity)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

