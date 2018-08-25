# InsightsServiceCatalogApi.OrderItem

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **String** |  | [optional] 
**count** | **Number** |  | 
**parameters** | [**[ParameterValue]**](ParameterValue.md) |  | 
**planId** | **String** | Stores the Plan ID from the catalog | [optional] 
**catalogId** | **String** | Stores the Catalog ID from the provider | [optional] 
**providerId** | **String** | ID of the provider object | [optional] 
**orderId** | **String** | ID of the order object | [optional] 
**state** | **String** | Current State of this order item | [optional] 
**createdAt** | **Date** |  | [optional] 
**orderedAt** | **Date** |  | [optional] 
**completedAt** | **Date** |  | [optional] 
**updatedAt** | **Date** |  | [optional] 
**externalRef** | **String** | An external reference from the provider that can be used to track the progress of the order item | [optional] 


<a name="StateEnum"></a>
## Enum: StateEnum


* `Created` (value: `"Created"`)

* `Ordered` (value: `"Ordered"`)

* `Failed` (value: `"Failed"`)

* `Completed` (value: `"Completed"`)




