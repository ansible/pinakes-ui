# TopologicalInventory.DefaultApi

All URIs are relative to *https://virtserver.swaggerhub.com/api/v0.0*

Method | HTTP request | Description
------------- | ------------- | -------------
[**createEndpoint**](DefaultApi.md#createEndpoint) | **POST** /endpoints | Create a new Endpoint
[**createSource**](DefaultApi.md#createSource) | **POST** /sources | Create a new Source
[**deleteEndpoint**](DefaultApi.md#deleteEndpoint) | **DELETE** /endpoints/{id} | Delete an existing Endpoint
[**deleteSource**](DefaultApi.md#deleteSource) | **DELETE** /sources/{id} | Delete an existing Source
[**listContainerGroups**](DefaultApi.md#listContainerGroups) | **GET** /container_groups | List ContainerGroups
[**listContainerNodes**](DefaultApi.md#listContainerNodes) | **GET** /container_nodes | List ContainerNodes
[**listContainerProjects**](DefaultApi.md#listContainerProjects) | **GET** /container_projects | List ContainerProjects
[**listContainerTemplates**](DefaultApi.md#listContainerTemplates) | **GET** /container_templates | List ContainerTemplates
[**listEndpoints**](DefaultApi.md#listEndpoints) | **GET** /endpoints | List Endpoints
[**listServiceInstances**](DefaultApi.md#listServiceInstances) | **GET** /service_instances | List ServiceInstances
[**listServiceOfferings**](DefaultApi.md#listServiceOfferings) | **GET** /service_offerings | List ServiceOfferings
[**listServiceParametersSets**](DefaultApi.md#listServiceParametersSets) | **GET** /service_parameters_sets | List ServiceParametersSets
[**listSources**](DefaultApi.md#listSources) | **GET** /sources | List Sources
[**replaceEndpoint**](DefaultApi.md#replaceEndpoint) | **PUT** /endpoints/{id} | Replace an existing Endpoint
[**replaceSource**](DefaultApi.md#replaceSource) | **PUT** /sources/{id} | Replace an existing Source
[**showContainerGroup**](DefaultApi.md#showContainerGroup) | **GET** /container_groups/{id} | Show an existing ContainerGroup
[**showContainerNode**](DefaultApi.md#showContainerNode) | **GET** /container_nodes/{id} | Show an existing ContainerNode
[**showContainerProject**](DefaultApi.md#showContainerProject) | **GET** /container_projects/{id} | Show an existing ContainerProject
[**showContainerTemplate**](DefaultApi.md#showContainerTemplate) | **GET** /container_templates/{id} | Show an existing ContainerTemplate
[**showEndpoint**](DefaultApi.md#showEndpoint) | **GET** /endpoints/{id} | Show an existing Endpoint
[**showServiceInstance**](DefaultApi.md#showServiceInstance) | **GET** /service_instances/{id} | Show an existing ServiceInstance
[**showServiceOffering**](DefaultApi.md#showServiceOffering) | **GET** /service_offerings/{id} | Show an existing ServiceOffering
[**showServiceParametersSet**](DefaultApi.md#showServiceParametersSet) | **GET** /service_parameters_sets/{id} | Show an existing ServiceParametersSet
[**showSource**](DefaultApi.md#showSource) | **GET** /sources/{id} | Show an existing Source
[**updateEndpoint**](DefaultApi.md#updateEndpoint) | **PATCH** /endpoints/{id} | Update an existing Endpoint
[**updateSource**](DefaultApi.md#updateSource) | **PATCH** /sources/{id} | Update an existing Source


<a name="createEndpoint"></a>
# **createEndpoint**
> Object createEndpoint(body)

Create a new Endpoint

Creates a Endpoint object

### Example
```javascript
import TopologicalInventory from 'topological_inventory';
let defaultClient = TopologicalInventory.ApiClient.instance;

// Configure HTTP basic authorization: UserSecurity
let UserSecurity = defaultClient.authentications['UserSecurity'];
UserSecurity.username = 'YOUR USERNAME';
UserSecurity.password = 'YOUR PASSWORD';

let apiInstance = new TopologicalInventory.DefaultApi();

let body = new TopologicalInventory.Id(); // Id | 

apiInstance.createEndpoint(body).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | [**Id**](Id.md)|  | 

### Return type

**Object**

### Authorization

[UserSecurity](../README.md#UserSecurity)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="createSource"></a>
# **createSource**
> Object createSource(body)

Create a new Source

Creates a Source object

### Example
```javascript
import TopologicalInventory from 'topological_inventory';
let defaultClient = TopologicalInventory.ApiClient.instance;

// Configure HTTP basic authorization: UserSecurity
let UserSecurity = defaultClient.authentications['UserSecurity'];
UserSecurity.username = 'YOUR USERNAME';
UserSecurity.password = 'YOUR PASSWORD';

let apiInstance = new TopologicalInventory.DefaultApi();

let body = new TopologicalInventory.Id(); // Id | 

apiInstance.createSource(body).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | [**Id**](Id.md)|  | 

### Return type

**Object**

### Authorization

[UserSecurity](../README.md#UserSecurity)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="deleteEndpoint"></a>
# **deleteEndpoint**
> deleteEndpoint(id)

Delete an existing Endpoint

Deletes a Endpoint object

### Example
```javascript
import TopologicalInventory from 'topological_inventory';
let defaultClient = TopologicalInventory.ApiClient.instance;

// Configure HTTP basic authorization: UserSecurity
let UserSecurity = defaultClient.authentications['UserSecurity'];
UserSecurity.username = 'YOUR USERNAME';
UserSecurity.password = 'YOUR PASSWORD';

let apiInstance = new TopologicalInventory.DefaultApi();

let id = "id_example"; // String | ID of the resource to return

apiInstance.deleteEndpoint(id).then(() => {
  console.log('API called successfully.');
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | [**String**](.md)| ID of the resource to return | 

### Return type

null (empty response body)

### Authorization

[UserSecurity](../README.md#UserSecurity)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="deleteSource"></a>
# **deleteSource**
> deleteSource(id)

Delete an existing Source

Deletes a Source object

### Example
```javascript
import TopologicalInventory from 'topological_inventory';
let defaultClient = TopologicalInventory.ApiClient.instance;

// Configure HTTP basic authorization: UserSecurity
let UserSecurity = defaultClient.authentications['UserSecurity'];
UserSecurity.username = 'YOUR USERNAME';
UserSecurity.password = 'YOUR PASSWORD';

let apiInstance = new TopologicalInventory.DefaultApi();

let id = "id_example"; // String | ID of the resource to return

apiInstance.deleteSource(id).then(() => {
  console.log('API called successfully.');
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | [**String**](.md)| ID of the resource to return | 

### Return type

null (empty response body)

### Authorization

[UserSecurity](../README.md#UserSecurity)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="listContainerGroups"></a>
# **listContainerGroups**
> [ContainerGroup] listContainerGroups()

List ContainerGroups

Returns an array of ContainerGroup objects

### Example
```javascript
import TopologicalInventory from 'topological_inventory';
let defaultClient = TopologicalInventory.ApiClient.instance;

// Configure HTTP basic authorization: UserSecurity
let UserSecurity = defaultClient.authentications['UserSecurity'];
UserSecurity.username = 'YOUR USERNAME';
UserSecurity.password = 'YOUR PASSWORD';

let apiInstance = new TopologicalInventory.DefaultApi();
apiInstance.listContainerGroups().then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters
This endpoint does not need any parameter.

### Return type

[**[ContainerGroup]**](ContainerGroup.md)

### Authorization

[UserSecurity](../README.md#UserSecurity)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="listContainerNodes"></a>
# **listContainerNodes**
> [ContainerNode] listContainerNodes()

List ContainerNodes

Returns an array of ContainerNode objects

### Example
```javascript
import TopologicalInventory from 'topological_inventory';
let defaultClient = TopologicalInventory.ApiClient.instance;

// Configure HTTP basic authorization: UserSecurity
let UserSecurity = defaultClient.authentications['UserSecurity'];
UserSecurity.username = 'YOUR USERNAME';
UserSecurity.password = 'YOUR PASSWORD';

let apiInstance = new TopologicalInventory.DefaultApi();
apiInstance.listContainerNodes().then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters
This endpoint does not need any parameter.

### Return type

[**[ContainerNode]**](ContainerNode.md)

### Authorization

[UserSecurity](../README.md#UserSecurity)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="listContainerProjects"></a>
# **listContainerProjects**
> [ContainerProject] listContainerProjects()

List ContainerProjects

Returns an array of ContainerProject objects

### Example
```javascript
import TopologicalInventory from 'topological_inventory';
let defaultClient = TopologicalInventory.ApiClient.instance;

// Configure HTTP basic authorization: UserSecurity
let UserSecurity = defaultClient.authentications['UserSecurity'];
UserSecurity.username = 'YOUR USERNAME';
UserSecurity.password = 'YOUR PASSWORD';

let apiInstance = new TopologicalInventory.DefaultApi();
apiInstance.listContainerProjects().then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters
This endpoint does not need any parameter.

### Return type

[**[ContainerProject]**](ContainerProject.md)

### Authorization

[UserSecurity](../README.md#UserSecurity)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="listContainerTemplates"></a>
# **listContainerTemplates**
> [ContainerTemplate] listContainerTemplates()

List ContainerTemplates

Returns an array of ContainerTemplate objects

### Example
```javascript
import TopologicalInventory from 'topological_inventory';
let defaultClient = TopologicalInventory.ApiClient.instance;

// Configure HTTP basic authorization: UserSecurity
let UserSecurity = defaultClient.authentications['UserSecurity'];
UserSecurity.username = 'YOUR USERNAME';
UserSecurity.password = 'YOUR PASSWORD';

let apiInstance = new TopologicalInventory.DefaultApi();
apiInstance.listContainerTemplates().then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters
This endpoint does not need any parameter.

### Return type

[**[ContainerTemplate]**](ContainerTemplate.md)

### Authorization

[UserSecurity](../README.md#UserSecurity)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="listEndpoints"></a>
# **listEndpoints**
> [Endpoint] listEndpoints()

List Endpoints

Returns an array of Endpoint objects

### Example
```javascript
import TopologicalInventory from 'topological_inventory';
let defaultClient = TopologicalInventory.ApiClient.instance;

// Configure HTTP basic authorization: UserSecurity
let UserSecurity = defaultClient.authentications['UserSecurity'];
UserSecurity.username = 'YOUR USERNAME';
UserSecurity.password = 'YOUR PASSWORD';

let apiInstance = new TopologicalInventory.DefaultApi();
apiInstance.listEndpoints().then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters
This endpoint does not need any parameter.

### Return type

[**[Endpoint]**](Endpoint.md)

### Authorization

[UserSecurity](../README.md#UserSecurity)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="listServiceInstances"></a>
# **listServiceInstances**
> [ServiceInstance] listServiceInstances()

List ServiceInstances

Returns an array of ServiceInstance objects

### Example
```javascript
import TopologicalInventory from 'topological_inventory';
let defaultClient = TopologicalInventory.ApiClient.instance;

// Configure HTTP basic authorization: UserSecurity
let UserSecurity = defaultClient.authentications['UserSecurity'];
UserSecurity.username = 'YOUR USERNAME';
UserSecurity.password = 'YOUR PASSWORD';

let apiInstance = new TopologicalInventory.DefaultApi();
apiInstance.listServiceInstances().then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters
This endpoint does not need any parameter.

### Return type

[**[ServiceInstance]**](ServiceInstance.md)

### Authorization

[UserSecurity](../README.md#UserSecurity)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="listServiceOfferings"></a>
# **listServiceOfferings**
> [ServiceOffering] listServiceOfferings()

List ServiceOfferings

Returns an array of ServiceOffering objects

### Example
```javascript
import TopologicalInventory from 'topological_inventory';
let defaultClient = TopologicalInventory.ApiClient.instance;

// Configure HTTP basic authorization: UserSecurity
let UserSecurity = defaultClient.authentications['UserSecurity'];
UserSecurity.username = 'YOUR USERNAME';
UserSecurity.password = 'YOUR PASSWORD';

let apiInstance = new TopologicalInventory.DefaultApi();
apiInstance.listServiceOfferings().then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters
This endpoint does not need any parameter.

### Return type

[**[ServiceOffering]**](ServiceOffering.md)

### Authorization

[UserSecurity](../README.md#UserSecurity)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="listServiceParametersSets"></a>
# **listServiceParametersSets**
> [ServiceParametersSet] listServiceParametersSets()

List ServiceParametersSets

Returns an array of ServiceParametersSet objects

### Example
```javascript
import TopologicalInventory from 'topological_inventory';
let defaultClient = TopologicalInventory.ApiClient.instance;

// Configure HTTP basic authorization: UserSecurity
let UserSecurity = defaultClient.authentications['UserSecurity'];
UserSecurity.username = 'YOUR USERNAME';
UserSecurity.password = 'YOUR PASSWORD';

let apiInstance = new TopologicalInventory.DefaultApi();
apiInstance.listServiceParametersSets().then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters
This endpoint does not need any parameter.

### Return type

[**[ServiceParametersSet]**](ServiceParametersSet.md)

### Authorization

[UserSecurity](../README.md#UserSecurity)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="listSources"></a>
# **listSources**
> [Source] listSources()

List Sources

Returns an array of Source objects

### Example
```javascript
import TopologicalInventory from 'topological_inventory';
let defaultClient = TopologicalInventory.ApiClient.instance;

// Configure HTTP basic authorization: UserSecurity
let UserSecurity = defaultClient.authentications['UserSecurity'];
UserSecurity.username = 'YOUR USERNAME';
UserSecurity.password = 'YOUR PASSWORD';

let apiInstance = new TopologicalInventory.DefaultApi();
apiInstance.listSources().then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters
This endpoint does not need any parameter.

### Return type

[**[Source]**](Source.md)

### Authorization

[UserSecurity](../README.md#UserSecurity)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="replaceEndpoint"></a>
# **replaceEndpoint**
> replaceEndpoint(id)

Replace an existing Endpoint

Replaces a Endpoint object

### Example
```javascript
import TopologicalInventory from 'topological_inventory';
let defaultClient = TopologicalInventory.ApiClient.instance;

// Configure HTTP basic authorization: UserSecurity
let UserSecurity = defaultClient.authentications['UserSecurity'];
UserSecurity.username = 'YOUR USERNAME';
UserSecurity.password = 'YOUR PASSWORD';

let apiInstance = new TopologicalInventory.DefaultApi();

let id = "id_example"; // String | ID of the resource to return

apiInstance.replaceEndpoint(id).then(() => {
  console.log('API called successfully.');
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | [**String**](.md)| ID of the resource to return | 

### Return type

null (empty response body)

### Authorization

[UserSecurity](../README.md#UserSecurity)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="replaceSource"></a>
# **replaceSource**
> replaceSource(id)

Replace an existing Source

Replaces a Source object

### Example
```javascript
import TopologicalInventory from 'topological_inventory';
let defaultClient = TopologicalInventory.ApiClient.instance;

// Configure HTTP basic authorization: UserSecurity
let UserSecurity = defaultClient.authentications['UserSecurity'];
UserSecurity.username = 'YOUR USERNAME';
UserSecurity.password = 'YOUR PASSWORD';

let apiInstance = new TopologicalInventory.DefaultApi();

let id = "id_example"; // String | ID of the resource to return

apiInstance.replaceSource(id).then(() => {
  console.log('API called successfully.');
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | [**String**](.md)| ID of the resource to return | 

### Return type

null (empty response body)

### Authorization

[UserSecurity](../README.md#UserSecurity)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="showContainerGroup"></a>
# **showContainerGroup**
> ContainerGroup showContainerGroup(id)

Show an existing ContainerGroup

Returns a ContainerGroup object

### Example
```javascript
import TopologicalInventory from 'topological_inventory';
let defaultClient = TopologicalInventory.ApiClient.instance;

// Configure HTTP basic authorization: UserSecurity
let UserSecurity = defaultClient.authentications['UserSecurity'];
UserSecurity.username = 'YOUR USERNAME';
UserSecurity.password = 'YOUR PASSWORD';

let apiInstance = new TopologicalInventory.DefaultApi();

let id = "id_example"; // String | ID of the resource to return

apiInstance.showContainerGroup(id).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | [**String**](.md)| ID of the resource to return | 

### Return type

[**ContainerGroup**](ContainerGroup.md)

### Authorization

[UserSecurity](../README.md#UserSecurity)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="showContainerNode"></a>
# **showContainerNode**
> ContainerNode showContainerNode(id)

Show an existing ContainerNode

Returns a ContainerNode object

### Example
```javascript
import TopologicalInventory from 'topological_inventory';
let defaultClient = TopologicalInventory.ApiClient.instance;

// Configure HTTP basic authorization: UserSecurity
let UserSecurity = defaultClient.authentications['UserSecurity'];
UserSecurity.username = 'YOUR USERNAME';
UserSecurity.password = 'YOUR PASSWORD';

let apiInstance = new TopologicalInventory.DefaultApi();

let id = "id_example"; // String | ID of the resource to return

apiInstance.showContainerNode(id).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | [**String**](.md)| ID of the resource to return | 

### Return type

[**ContainerNode**](ContainerNode.md)

### Authorization

[UserSecurity](../README.md#UserSecurity)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="showContainerProject"></a>
# **showContainerProject**
> ContainerProject showContainerProject(id)

Show an existing ContainerProject

Returns a ContainerProject object

### Example
```javascript
import TopologicalInventory from 'topological_inventory';
let defaultClient = TopologicalInventory.ApiClient.instance;

// Configure HTTP basic authorization: UserSecurity
let UserSecurity = defaultClient.authentications['UserSecurity'];
UserSecurity.username = 'YOUR USERNAME';
UserSecurity.password = 'YOUR PASSWORD';

let apiInstance = new TopologicalInventory.DefaultApi();

let id = "id_example"; // String | ID of the resource to return

apiInstance.showContainerProject(id).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | [**String**](.md)| ID of the resource to return | 

### Return type

[**ContainerProject**](ContainerProject.md)

### Authorization

[UserSecurity](../README.md#UserSecurity)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="showContainerTemplate"></a>
# **showContainerTemplate**
> ContainerTemplate showContainerTemplate(id)

Show an existing ContainerTemplate

Returns a ContainerTemplate object

### Example
```javascript
import TopologicalInventory from 'topological_inventory';
let defaultClient = TopologicalInventory.ApiClient.instance;

// Configure HTTP basic authorization: UserSecurity
let UserSecurity = defaultClient.authentications['UserSecurity'];
UserSecurity.username = 'YOUR USERNAME';
UserSecurity.password = 'YOUR PASSWORD';

let apiInstance = new TopologicalInventory.DefaultApi();

let id = "id_example"; // String | ID of the resource to return

apiInstance.showContainerTemplate(id).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | [**String**](.md)| ID of the resource to return | 

### Return type

[**ContainerTemplate**](ContainerTemplate.md)

### Authorization

[UserSecurity](../README.md#UserSecurity)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="showEndpoint"></a>
# **showEndpoint**
> Endpoint showEndpoint(id)

Show an existing Endpoint

Returns a Endpoint object

### Example
```javascript
import TopologicalInventory from 'topological_inventory';
let defaultClient = TopologicalInventory.ApiClient.instance;

// Configure HTTP basic authorization: UserSecurity
let UserSecurity = defaultClient.authentications['UserSecurity'];
UserSecurity.username = 'YOUR USERNAME';
UserSecurity.password = 'YOUR PASSWORD';

let apiInstance = new TopologicalInventory.DefaultApi();

let id = "id_example"; // String | ID of the resource to return

apiInstance.showEndpoint(id).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | [**String**](.md)| ID of the resource to return | 

### Return type

[**Endpoint**](Endpoint.md)

### Authorization

[UserSecurity](../README.md#UserSecurity)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="showServiceInstance"></a>
# **showServiceInstance**
> ServiceInstance showServiceInstance(id)

Show an existing ServiceInstance

Returns a ServiceInstance object

### Example
```javascript
import TopologicalInventory from 'topological_inventory';
let defaultClient = TopologicalInventory.ApiClient.instance;

// Configure HTTP basic authorization: UserSecurity
let UserSecurity = defaultClient.authentications['UserSecurity'];
UserSecurity.username = 'YOUR USERNAME';
UserSecurity.password = 'YOUR PASSWORD';

let apiInstance = new TopologicalInventory.DefaultApi();

let id = "id_example"; // String | ID of the resource to return

apiInstance.showServiceInstance(id).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | [**String**](.md)| ID of the resource to return | 

### Return type

[**ServiceInstance**](ServiceInstance.md)

### Authorization

[UserSecurity](../README.md#UserSecurity)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="showServiceOffering"></a>
# **showServiceOffering**
> ServiceOffering showServiceOffering(id)

Show an existing ServiceOffering

Returns a ServiceOffering object

### Example
```javascript
import TopologicalInventory from 'topological_inventory';
let defaultClient = TopologicalInventory.ApiClient.instance;

// Configure HTTP basic authorization: UserSecurity
let UserSecurity = defaultClient.authentications['UserSecurity'];
UserSecurity.username = 'YOUR USERNAME';
UserSecurity.password = 'YOUR PASSWORD';

let apiInstance = new TopologicalInventory.DefaultApi();

let id = "id_example"; // String | ID of the resource to return

apiInstance.showServiceOffering(id).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | [**String**](.md)| ID of the resource to return | 

### Return type

[**ServiceOffering**](ServiceOffering.md)

### Authorization

[UserSecurity](../README.md#UserSecurity)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="showServiceParametersSet"></a>
# **showServiceParametersSet**
> ServiceParametersSet showServiceParametersSet(id)

Show an existing ServiceParametersSet

Returns a ServiceParametersSet object

### Example
```javascript
import TopologicalInventory from 'topological_inventory';
let defaultClient = TopologicalInventory.ApiClient.instance;

// Configure HTTP basic authorization: UserSecurity
let UserSecurity = defaultClient.authentications['UserSecurity'];
UserSecurity.username = 'YOUR USERNAME';
UserSecurity.password = 'YOUR PASSWORD';

let apiInstance = new TopologicalInventory.DefaultApi();

let id = "id_example"; // String | ID of the resource to return

apiInstance.showServiceParametersSet(id).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | [**String**](.md)| ID of the resource to return | 

### Return type

[**ServiceParametersSet**](ServiceParametersSet.md)

### Authorization

[UserSecurity](../README.md#UserSecurity)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="showSource"></a>
# **showSource**
> Source showSource(id)

Show an existing Source

Returns a Source object

### Example
```javascript
import TopologicalInventory from 'topological_inventory';
let defaultClient = TopologicalInventory.ApiClient.instance;

// Configure HTTP basic authorization: UserSecurity
let UserSecurity = defaultClient.authentications['UserSecurity'];
UserSecurity.username = 'YOUR USERNAME';
UserSecurity.password = 'YOUR PASSWORD';

let apiInstance = new TopologicalInventory.DefaultApi();

let id = "id_example"; // String | ID of the resource to return

apiInstance.showSource(id).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | [**String**](.md)| ID of the resource to return | 

### Return type

[**Source**](Source.md)

### Authorization

[UserSecurity](../README.md#UserSecurity)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="updateEndpoint"></a>
# **updateEndpoint**
> updateEndpoint(id)

Update an existing Endpoint

Updates a Endpoint object

### Example
```javascript
import TopologicalInventory from 'topological_inventory';
let defaultClient = TopologicalInventory.ApiClient.instance;

// Configure HTTP basic authorization: UserSecurity
let UserSecurity = defaultClient.authentications['UserSecurity'];
UserSecurity.username = 'YOUR USERNAME';
UserSecurity.password = 'YOUR PASSWORD';

let apiInstance = new TopologicalInventory.DefaultApi();

let id = "id_example"; // String | ID of the resource to return

apiInstance.updateEndpoint(id).then(() => {
  console.log('API called successfully.');
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | [**String**](.md)| ID of the resource to return | 

### Return type

null (empty response body)

### Authorization

[UserSecurity](../README.md#UserSecurity)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="updateSource"></a>
# **updateSource**
> updateSource(id)

Update an existing Source

Updates a Source object

### Example
```javascript
import TopologicalInventory from 'topological_inventory';
let defaultClient = TopologicalInventory.ApiClient.instance;

// Configure HTTP basic authorization: UserSecurity
let UserSecurity = defaultClient.authentications['UserSecurity'];
UserSecurity.username = 'YOUR USERNAME';
UserSecurity.password = 'YOUR PASSWORD';

let apiInstance = new TopologicalInventory.DefaultApi();

let id = "id_example"; // String | ID of the resource to return

apiInstance.updateSource(id).then(() => {
  console.log('API called successfully.');
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | [**String**](.md)| ID of the resource to return | 

### Return type

null (empty response body)

### Authorization

[UserSecurity](../README.md#UserSecurity)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

