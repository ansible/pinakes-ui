# InsightsHsdmApi.UsersApi

All URIs are relative to *https://virtserver.swaggerhub.com/mkanoor/InsightsCatalog/1.0.0*

Method | HTTP request | Description
------------- | ------------- | -------------
[**addProvider**](UsersApi.md#addProvider) | **POST** /providers | Temporary API to add a new provider
[**addToOrder**](UsersApi.md#addToOrder) | **POST** /orders/{order_id}/items | Add a Catalog to the Order in Pending State
[**catalogItems**](UsersApi.md#catalogItems) | **GET** /catalog_items | fetches catalog items from all providers
[**catalogParameters**](UsersApi.md#catalogParameters) | **GET** /providers/{provider_id}/catalog_items/{catalog_id}/parameters | Fetches catalog parameters, it needs the provider id, the catalog_id
[**fetchCatalogItemWithProvider**](UsersApi.md#fetchCatalogItemWithProvider) | **GET** /providers/{provider_id}/catalog_items | Fetch all or a specific catalog item from a specific provider
[**fetchCatalogItemWithProviderAndCatalogID**](UsersApi.md#fetchCatalogItemWithProviderAndCatalogID) | **GET** /providers/{provider_id}/catalog_items/{catalog_id} | Fetches a specific catalog item for a provider
[**listOrderItem**](UsersApi.md#listOrderItem) | **GET** /orders/{order_id}/items/{order_item_id} | Get an individual item from a given order
[**listOrderItems**](UsersApi.md#listOrderItems) | **GET** /orders/{order_id}/items | Get a list of items in a given order
[**listOrders**](UsersApi.md#listOrders) | **GET** /orders | Get a list of orders
[**listProgressMessages**](UsersApi.md#listProgressMessages) | **GET** /order_items/{order_item_id}/progress_messages | Get a list of progress messages in an item
[**listProviders**](UsersApi.md#listProviders) | **GET** /providers | Temporary API to list provider
[**newOrder**](UsersApi.md#newOrder) | **POST** /orders | Create a new order
[**submitOrder**](UsersApi.md#submitOrder) | **POST** /orders/{order_id} | Submit the given order


<a name="addProvider"></a>
# **addProvider**
> Object addProvider(body)

Temporary API to add a new provider

Returns the added provider object 

### Example
```javascript
import InsightsHsdmApi from 'insights_hsdm_api';
let defaultClient = InsightsHsdmApi.ApiClient.instance;

// Configure HTTP basic authorization: UserSecurity
let UserSecurity = defaultClient.authentications['UserSecurity'];
UserSecurity.username = 'YOUR USERNAME';
UserSecurity.password = 'YOUR PASSWORD';

let apiInstance = new InsightsHsdmApi.UsersApi();

let body = new InsightsHsdmApi.Provider(); // Provider | 

apiInstance.addProvider(body).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | [**Provider**](Provider.md)|  | 

### Return type

**Object**

### Authorization

[UserSecurity](../README.md#UserSecurity)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="addToOrder"></a>
# **addToOrder**
> addToOrder(orderId, item)

Add a Catalog to the Order in Pending State

Add a catalog item to the order in Pending State 

### Example
```javascript
import InsightsHsdmApi from 'insights_hsdm_api';
let defaultClient = InsightsHsdmApi.ApiClient.instance;

// Configure HTTP basic authorization: UserSecurity
let UserSecurity = defaultClient.authentications['UserSecurity'];
UserSecurity.username = 'YOUR USERNAME';
UserSecurity.password = 'YOUR PASSWORD';

let apiInstance = new InsightsHsdmApi.UsersApi();

let orderId = "orderId_example"; // String | The Order ID

let item = new InsightsHsdmApi.OrderItem(); // OrderItem | 


apiInstance.addToOrder(orderId, item, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **orderId** | [**String**](.md)| The Order ID | 
 **item** | [**OrderItem**](OrderItem.md)|  | 

### Return type

null (empty response body)

### Authorization

[UserSecurity](../README.md#UserSecurity)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="catalogItems"></a>
# **catalogItems**
> [CatalogItem] catalogItems()

fetches catalog items from all providers

Fetch catalog item from all defined providers 

### Example
```javascript
import InsightsHsdmApi from 'insights_hsdm_api';
let defaultClient = InsightsHsdmApi.ApiClient.instance;

// Configure HTTP basic authorization: UserSecurity
let UserSecurity = defaultClient.authentications['UserSecurity'];
UserSecurity.username = 'YOUR USERNAME';
UserSecurity.password = 'YOUR PASSWORD';

let apiInstance = new InsightsHsdmApi.UsersApi();

apiInstance.catalogItems((error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**[CatalogItem]**](CatalogItem.md)

### Authorization

[UserSecurity](../README.md#UserSecurity)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="catalogParameters"></a>
# **catalogParameters**
> [CatalogParameter] catalogParameters(providerId, catalogId)

Fetches catalog parameters, it needs the provider id, the catalog_id

Return a JSON object with the parameters needed for a catalogItem 

### Example
```javascript
import InsightsHsdmApi from 'insights_hsdm_api';
let defaultClient = InsightsHsdmApi.ApiClient.instance;

// Configure HTTP basic authorization: UserSecurity
let UserSecurity = defaultClient.authentications['UserSecurity'];
UserSecurity.username = 'YOUR USERNAME';
UserSecurity.password = 'YOUR PASSWORD';

let apiInstance = new InsightsHsdmApi.UsersApi();

let providerId = "providerId_example"; // String | The Provider ID

let catalogId = "catalogId_example"; // String | The Catalog ID


apiInstance.catalogParameters(providerId, catalogId, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **providerId** | [**String**](.md)| The Provider ID | 
 **catalogId** | [**String**](.md)| The Catalog ID | 

### Return type

[**[CatalogParameter]**](CatalogParameter.md)

### Authorization

[UserSecurity](../README.md#UserSecurity)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="fetchCatalogItemWithProvider"></a>
# **fetchCatalogItemWithProvider**
> [CatalogItem] fetchCatalogItemWithProvider(providerId, opts)

Fetch all or a specific catalog item from a specific provider

By passing in the provider id you can fetch all the catalog items in the provider. You can limit to a specific catalog item by passing its id 

### Example
```javascript
import InsightsHsdmApi from 'insights_hsdm_api';
let defaultClient = InsightsHsdmApi.ApiClient.instance;

// Configure HTTP basic authorization: UserSecurity
let UserSecurity = defaultClient.authentications['UserSecurity'];
UserSecurity.username = 'YOUR USERNAME';
UserSecurity.password = 'YOUR PASSWORD';

let apiInstance = new InsightsHsdmApi.UsersApi();

let providerId = "providerId_example"; // String | The Provider ID

let opts = { 
  'catalogId': "catalogId_example" // String | The Catalog ID
};

apiInstance.fetchCatalogItemWithProvider(providerId, opts, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
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

[UserSecurity](../README.md#UserSecurity)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="fetchCatalogItemWithProviderAndCatalogID"></a>
# **fetchCatalogItemWithProviderAndCatalogID**
> [CatalogItem] fetchCatalogItemWithProviderAndCatalogID(providerId, catalogId)

Fetches a specific catalog item for a provider

Fetch a catalog item by its ID and provider ID 

### Example
```javascript
import InsightsHsdmApi from 'insights_hsdm_api';
let defaultClient = InsightsHsdmApi.ApiClient.instance;

// Configure HTTP basic authorization: UserSecurity
let UserSecurity = defaultClient.authentications['UserSecurity'];
UserSecurity.username = 'YOUR USERNAME';
UserSecurity.password = 'YOUR PASSWORD';

let apiInstance = new InsightsHsdmApi.UsersApi();

let providerId = "providerId_example"; // String | The Provider ID

let catalogId = "catalogId_example"; // String | The Catalog ID


apiInstance.fetchCatalogItemWithProviderAndCatalogID(providerId, catalogId, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
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

[UserSecurity](../README.md#UserSecurity)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="listOrderItem"></a>
# **listOrderItem**
> OrderItem listOrderItem(orderId, orderItemId)

Get an individual item from a given order

Get an item associated with an order. 

### Example
```javascript
import InsightsHsdmApi from 'insights_hsdm_api';
let defaultClient = InsightsHsdmApi.ApiClient.instance;

// Configure HTTP basic authorization: UserSecurity
let UserSecurity = defaultClient.authentications['UserSecurity'];
UserSecurity.username = 'YOUR USERNAME';
UserSecurity.password = 'YOUR PASSWORD';

let apiInstance = new InsightsHsdmApi.UsersApi();

let orderId = "orderId_example"; // String | The Order ID

let orderItemId = "orderItemId_example"; // String | The Order Item ID


apiInstance.listOrderItem(orderId, orderItemId, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **orderId** | [**String**](.md)| The Order ID | 
 **orderItemId** | [**String**](.md)| The Order Item ID | 

### Return type

[**OrderItem**](OrderItem.md)

### Authorization

[UserSecurity](../README.md#UserSecurity)

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
import InsightsHsdmApi from 'insights_hsdm_api';
let defaultClient = InsightsHsdmApi.ApiClient.instance;

// Configure HTTP basic authorization: UserSecurity
let UserSecurity = defaultClient.authentications['UserSecurity'];
UserSecurity.username = 'YOUR USERNAME';
UserSecurity.password = 'YOUR PASSWORD';

let apiInstance = new InsightsHsdmApi.UsersApi();

let orderId = "orderId_example"; // String | The Order ID


apiInstance.listOrderItems(orderId, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **orderId** | [**String**](.md)| The Order ID | 

### Return type

[**[OrderItem]**](OrderItem.md)

### Authorization

[UserSecurity](../README.md#UserSecurity)

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
import InsightsHsdmApi from 'insights_hsdm_api';
let defaultClient = InsightsHsdmApi.ApiClient.instance;

// Configure HTTP basic authorization: UserSecurity
let UserSecurity = defaultClient.authentications['UserSecurity'];
UserSecurity.username = 'YOUR USERNAME';
UserSecurity.password = 'YOUR PASSWORD';

let apiInstance = new InsightsHsdmApi.UsersApi();

apiInstance.listOrders((error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**[Order]**](Order.md)

### Authorization

[UserSecurity](../README.md#UserSecurity)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="listProgressMessages"></a>
# **listProgressMessages**
> [ProgressMessage] listProgressMessages(orderItemId)

Get a list of progress messages in an item

Get a list of progress messages associated with an order item. As the item is being processed the provider can update the progress messages 

### Example
```javascript
import InsightsHsdmApi from 'insights_hsdm_api';
let defaultClient = InsightsHsdmApi.ApiClient.instance;

// Configure HTTP basic authorization: UserSecurity
let UserSecurity = defaultClient.authentications['UserSecurity'];
UserSecurity.username = 'YOUR USERNAME';
UserSecurity.password = 'YOUR PASSWORD';

let apiInstance = new InsightsHsdmApi.UsersApi();

let orderItemId = "orderItemId_example"; // String | The Order Item ID


apiInstance.listProgressMessages(orderItemId, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **orderItemId** | [**String**](.md)| The Order Item ID | 

### Return type

[**[ProgressMessage]**](ProgressMessage.md)

### Authorization

[UserSecurity](../README.md#UserSecurity)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="listProviders"></a>
# **listProviders**
> [Provider] listProviders()

Temporary API to list provider

Returns an array of provider objects 

### Example
```javascript
import InsightsHsdmApi from 'insights_hsdm_api';
let defaultClient = InsightsHsdmApi.ApiClient.instance;

// Configure HTTP basic authorization: UserSecurity
let UserSecurity = defaultClient.authentications['UserSecurity'];
UserSecurity.username = 'YOUR USERNAME';
UserSecurity.password = 'YOUR PASSWORD';

let apiInstance = new InsightsHsdmApi.UsersApi();

apiInstance.listProviders((error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**[Provider]**](Provider.md)

### Authorization

[UserSecurity](../README.md#UserSecurity)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="newOrder"></a>
# **newOrder**
> Order newOrder()

Create a new order

Create a new order. 

### Example
```javascript
import InsightsHsdmApi from 'insights_hsdm_api';
let defaultClient = InsightsHsdmApi.ApiClient.instance;

// Configure HTTP basic authorization: UserSecurity
let UserSecurity = defaultClient.authentications['UserSecurity'];
UserSecurity.username = 'YOUR USERNAME';
UserSecurity.password = 'YOUR PASSWORD';

let apiInstance = new InsightsHsdmApi.UsersApi();

apiInstance.newOrder((error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**Order**](Order.md)

### Authorization

[UserSecurity](../README.md#UserSecurity)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="submitOrder"></a>
# **submitOrder**
> Order submitOrder(orderId)

Submit the given order

Returns an updated order object 

### Example
```javascript
import InsightsHsdmApi from 'insights_hsdm_api';
let defaultClient = InsightsHsdmApi.ApiClient.instance;

// Configure HTTP basic authorization: UserSecurity
let UserSecurity = defaultClient.authentications['UserSecurity'];
UserSecurity.username = 'YOUR USERNAME';
UserSecurity.password = 'YOUR PASSWORD';

let apiInstance = new InsightsHsdmApi.UsersApi();

let orderId = "orderId_example"; // String | The Order ID


apiInstance.submitOrder(orderId, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **orderId** | [**String**](.md)| The Order ID | 

### Return type

[**Order**](Order.md)

### Authorization

[UserSecurity](../README.md#UserSecurity)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

