# svjs-observe

An ES6 Module to observe properties, Arrays, Sets and Maps of an Object. Can also intercept function calls.

Observing means to call a callback-function every value change of an Object property (or function call).

## Methods

### Observe.property(object, propertyName, callback)

Observe properties (attributes) of an object. Works also with Arrays, Maps and Sets. 
The parameter `propertyName` can be an array of names to observe multiple properties.

#### callback params

`{ propertyName: propertyName, oldValue: oldValue, newValue: newValue }`

#### Example

``` JavaScript
Observe.property(model, ["property1","property2"], (params) => {
    console.log("property changed", params.propertyName);
    console.log("oldValue", params.oldValue);
    console.log("newValue", params.newValue);
})
```

### Observe.preFunction(object, functionName, callback)

Intercept a function call, before the function is executed. Can manipulate
arguments in the callback.

#### callback params

`{functionName: functionName, arguments: functionArguments}`

### Observe.postFunction(object, functionName, callback)

Intercept a function call, after the function is executed. Can manipulate
returnValue in callback. 

#### callback params

`{functionName: functionName, arguments: functionArguments, returnValue: returnValue}`
