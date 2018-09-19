# InsightsServiceCatalogApi.AdminsApi

All URIs are relative to *https://virtserver.swaggerhub.com/r/insights/platform/service-catalog/1.0.0*

Method | HTTP request | Description
------------- | ------------- | -------------
[**addPortfolio**](AdminsApi.md#addPortfolio) | **POST** /portfolios | API to add a new portfolio
[**fetchPortfolioWithId**](AdminsApi.md#fetchPortfolioWithId) | **GET** /portfolio/{portfolio_id} | Fetch a specific Portfolio
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

<a name="fetchPortfolioWithId"></a>
# **fetchPortfolioWithId**
> Portfolio fetchPortfolioWithId(portfolioId)

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

apiInstance.fetchPortfolioWithId(portfolioId).then((data) => {
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

