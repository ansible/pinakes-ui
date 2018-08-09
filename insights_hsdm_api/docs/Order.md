# InsightsHsdmApi.Order

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **String** |  | [optional] 
**userId** | **String** |  | [optional] 
**state** | **String** | Current State of the order | [optional] 
**createdAt** | **Date** |  | [optional] 
**orderedAt** | **Date** |  | [optional] 
**completedAt** | **Date** |  | [optional] 
**orderItems** | [**[OrderItem]**](OrderItem.md) |  | [optional] 


<a name="StateEnum"></a>
## Enum: StateEnum


* `Created` (value: `"Created"`)

* `Ordered` (value: `"Ordered"`)

* `Failed` (value: `"Failed"`)

* `Completed` (value: `"Completed"`)




