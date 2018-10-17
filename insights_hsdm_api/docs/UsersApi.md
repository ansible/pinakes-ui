# InsightsServiceCatalogApi.UsersApi

All URIs are relative to *https://localhost/r/insights/platform/service-portal*

Method | HTTP request | Description
------------- | ------------- | -------------
[**catalogItems**](UsersApi.md#catalogItems) | **GET** /catalog_items | fetches catalog items from all providers
[**catalogPlanParameters**](UsersApi.md#catalogPlanParameters) | **GET** /providers/{provider_id}/catalog_items/{catalog_id}/plans/{plan_id}/parameters | Fetches catalog parameters, it needs the provider id, the catalog_id and the plan_id
[**catalogPlanSchema**](UsersApi.md#catalogPlanSchema) | **GET** /providers/{provider_id}/catalog_items/{catalog_id}/plans/{plan_id}/json_schema | Fetches catalog json schema, it needs the provider id, the catalog_id and the plan_id
[**fetchCatalogItemWithProvider**](UsersApi.md#fetchCatalogItemWithProvider) | **GET** /providers/{provider_id}/catalog_items | Fetch all or a specific catalog item from a specific provider
[**fetchCatalogItemWithProviderAndCatalogID**](UsersApi.md#fetchCatalogItemWithProviderAndCatalogID) | **GET** /providers/{provider_id}/catalog_items/{catalog_id} | Fetches a specific catalog item for a provider
[**fetchPlansWithProviderAndCatalogID**](UsersApi.md#fetchPlansWithProviderAndCatalogID) | **GET** /providers/{provider_id}/catalog_items/{catalog_id}/plans | Fetches all the plans for a specific catalog item for a provider
[**fetchPortfolioItemFromPortfolio**](UsersApi.md#fetchPortfolioItemFromPortfolio) | **GET** /portfolios/{portfolio_id}/portfolio_items/{portfolio_item_id} | Fetch a portfolio item from a specific portfolio
[**fetchPortfolioItemsWithPortfolio**](UsersApi.md#fetchPortfolioItemsWithPortfolio) | **GET** /portfolios/{portfolio_id}/portfolio_items | Fetch all portfolio items from a specific portfolio
[**fetchPortfolioWithId**](UsersApi.md#fetchPortfolioWithId) | **GET** /portfolios/{portfolio_id} | Fetch a specific Portfolio
[**listOrderItem**](UsersApi.md#listOrderItem) | **GET** /orders/{order_id}/items/{order_item_id} | Get an individual item from a given order
[**listOrderItems**](UsersApi.md#listOrderItems) | **GET** /orders/{order_id}/items | Get a list of items in a given order
[**listOrders**](UsersApi.md#listOrders) | **GET** /orders | Get a list of orders
[**listPortfolioItems**](UsersApi.md#listPortfolioItems) | **GET** /portfolio_items | API to list portfolio_items
[**listPortfolios**](UsersApi.md#listPortfolios) | **GET** /portfolios | API to list portfolios
[**listProgressMessages**](UsersApi.md#listProgressMessages) | **GET** /order_items/{order_item_id}/progress_messages | Get a list of progress messages in an item


<a name="catalogItems"></a>
# **catalogItems**
> [CatalogItem] catalogItems(opts)

fetches catalog items from all providers

Fetch catalog item from all defined providers 

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

let apiInstance = new InsightsServiceCatalogApi.UsersApi();

let opts = { 
  'limit': 56, // Number | How many catalog items to return at one time (max 1000)
  'offset': 0 // Number | Starting Offset
};
apiInstance.catalogItems(opts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **limit** | **Number**| How many catalog items to return at one time (max 1000) | [optional] 
 **offset** | **Number**| Starting Offset | [optional] [default to 0]

### Return type

[**[CatalogItem]**](CatalogItem.md)

### Authorization

[AdminSecurity](../README.md#AdminSecurity), [UserSecurity](../README.md#UserSecurity)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="catalogPlanParameters"></a>
# **catalogPlanParameters**
> [PlanParameter] catalogPlanParameters(providerId, catalogId, planId)

Fetches catalog parameters, it needs the provider id, the catalog_id and the plan_id

Return a JSON object with the parameters needed for a specific plan of a catalog item 

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

let apiInstance = new InsightsServiceCatalogApi.UsersApi();

let providerId = "providerId_example"; // String | The Provider ID

let catalogId = "catalogId_example"; // String | The Catalog ID

let planId = "planId_example"; // String | The Plan ID

apiInstance.catalogPlanParameters(providerId, catalogId, planId).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **providerId** | [**String**](.md)| The Provider ID | 
 **catalogId** | [**String**](.md)| The Catalog ID | 
 **planId** | **String**| The Plan ID | 

### Return type

[**[PlanParameter]**](PlanParameter.md)

### Authorization

[AdminSecurity](../README.md#AdminSecurity), [UserSecurity](../README.md#UserSecurity)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="catalogPlanSchema"></a>
# **catalogPlanSchema**
> JSONSchema catalogPlanSchema(providerId, catalogId, planId)

Fetches catalog json schema, it needs the provider id, the catalog_id and the plan_id

Return a JSON schema with the parameters needed for a specific plan of a catalog item 

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

let apiInstance = new InsightsServiceCatalogApi.UsersApi();

let providerId = "providerId_example"; // String | The Provider ID

let catalogId = "catalogId_example"; // String | The Catalog ID

let planId = "planId_example"; // String | The Plan ID

apiInstance.catalogPlanSchema(providerId, catalogId, planId).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **providerId** | [**String**](.md)| The Provider ID | 
 **catalogId** | [**String**](.md)| The Catalog ID | 
 **planId** | **String**| The Plan ID | 

### Return type

[**JSONSchema**](JSONSchema.md)

### Authorization

[AdminSecurity](../README.md#AdminSecurity), [UserSecurity](../README.md#UserSecurity)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="fetchCatalogItemWithProvider"></a>
# **fetchCatalogItemWithProvider**
> [CatalogItem] fetchCatalogItemWithProvider(providerId, , opts)

Fetch all or a specific catalog item from a specific provider

By passing in the provider id you can fetch all the catalog items in the provider. You can limit to a specific catalog item by passing its id 

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

let apiInstance = new InsightsServiceCatalogApi.UsersApi();

let providerId = "providerId_example"; // String | The Provider ID

let opts = { 
  'catalogId': "catalogId_example" // String | The Catalog ID
};
apiInstance.fetchCatalogItemWithProvider(providerId, , opts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **providerId** | [**String**](.md)| The Provider ID | 
 **catalogId** | [**String**](.md)| The Catalog ID | [optional] 

### Return type

[**[CatalogItem]**](CatalogItem.md)

### Authorization

[AdminSecurity](../README.md#AdminSecurity), [UserSecurity](../README.md#UserSecurity)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="fetchCatalogItemWithProviderAndCatalogID"></a>
# **fetchCatalogItemWithProviderAndCatalogID**
> [CatalogItem] fetchCatalogItemWithProviderAndCatalogID(providerId, catalogId, )

Fetches a specific catalog item for a provider

Fetch a catalog item by its ID and provider ID 

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

let apiInstance = new InsightsServiceCatalogApi.UsersApi();

let providerId = "providerId_example"; // String | The Provider ID

let catalogId = "catalogId_example"; // String | The Catalog ID

apiInstance.fetchCatalogItemWithProviderAndCatalogID(providerId, catalogId, ).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **providerId** | [**String**](.md)| The Provider ID | 
 **catalogId** | [**String**](.md)| The Catalog ID | 

### Return type

[**[CatalogItem]**](CatalogItem.md)

### Authorization

[AdminSecurity](../README.md#AdminSecurity), [UserSecurity](../README.md#UserSecurity)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="fetchPlansWithProviderAndCatalogID"></a>
# **fetchPlansWithProviderAndCatalogID**
> [CatalogPlan] fetchPlansWithProviderAndCatalogID(providerId, catalogId, )

Fetches all the plans for a specific catalog item for a provider

Fetch all plans for catalog item by its ID and provider ID 

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

let apiInstance = new InsightsServiceCatalogApi.UsersApi();

let providerId = "providerId_example"; // String | The Provider ID

let catalogId = "catalogId_example"; // String | The Catalog ID

apiInstance.fetchPlansWithProviderAndCatalogID(providerId, catalogId, ).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **providerId** | [**String**](.md)| The Provider ID | 
 **catalogId** | [**String**](.md)| The Catalog ID | 

### Return type

[**[CatalogPlan]**](CatalogPlan.md)

### Authorization

[AdminSecurity](../README.md#AdminSecurity), [UserSecurity](../README.md#UserSecurity)

### HTTP request headers

 - **Content-Type**: Not defined
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

let apiInstance = new InsightsServiceCatalogApi.UsersApi();

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

let apiInstance = new InsightsServiceCatalogApi.UsersApi();

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

let apiInstance = new InsightsServiceCatalogApi.UsersApi();

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

<a name="listOrderItem"></a>
# **listOrderItem**
> OrderItem listOrderItem(orderIdorderItemId)

Get an individual item from a given order

Get an item associated with an order. 

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

let apiInstance = new InsightsServiceCatalogApi.UsersApi();

let orderId = "orderId_example"; // String | The Order ID

let orderItemId = "orderItemId_example"; // String | The Order Item ID

apiInstance.listOrderItem(orderIdorderItemId).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **orderId** | **String**| The Order ID | 
 **orderItemId** | **String**| The Order Item ID | 

### Return type

[**OrderItem**](OrderItem.md)

### Authorization

[AdminSecurity](../README.md#AdminSecurity), [UserSecurity](../README.md#UserSecurity)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="listOrderItems"></a>
# **listOrderItems**
> [OrderItem] listOrderItems(orderId)

Get a list of items in a given order

Get a list of items associated with an order. 

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

let apiInstance = new InsightsServiceCatalogApi.UsersApi();

let orderId = "orderId_example"; // String | The Order ID

apiInstance.listOrderItems(orderId).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **orderId** | **String**| The Order ID | 

### Return type

[**[OrderItem]**](OrderItem.md)

### Authorization

[AdminSecurity](../README.md#AdminSecurity), [UserSecurity](../README.md#UserSecurity)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="listOrders"></a>
# **listOrders**
> [Order] listOrders()

Get a list of orders

Get a list of orders associated with the logged in user. 

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

let apiInstance = new InsightsServiceCatalogApi.UsersApi();
apiInstance.listOrders().then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters
This endpoint does not need any parameter.

### Return type

[**[Order]**](Order.md)

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

let apiInstance = new InsightsServiceCatalogApi.UsersApi();
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

let apiInstance = new InsightsServiceCatalogApi.UsersApi();
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

<a name="listProgressMessages"></a>
# **listProgressMessages**
> [ProgressMessage] listProgressMessages(orderItemId)

Get a list of progress messages in an item

Get a list of progress messages associated with an order item. As the item is being processed the provider can update the progress messages 

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

let apiInstance = new InsightsServiceCatalogApi.UsersApi();

let orderItemId = "orderItemId_example"; // String | The Order Item ID

apiInstance.listProgressMessages(orderItemId).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **orderItemId** | **String**| The Order Item ID | 

### Return type

[**[ProgressMessage]**](ProgressMessage.md)

### Authorization

[AdminSecurity](../README.md#AdminSecurity), [UserSecurity](../README.md#UserSecurity)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

