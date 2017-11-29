/**
 * Author: shaack
 * Date: 26.06.17
 */

const ARRAY_MANIPULATION_METHODS = [
    'copyWithin', 'fill', 'pop', 'push', 'reverse', 'shift', 'unshift', 'sort', 'splice'
];

// noinspection JSUnusedGlobalSymbols
export function debounce(func, context, wait) {
    let timer = null;
    return function () {
        let args = arguments;
        window.clearTimeout(timer);
        timer = setTimeout(function () {
            func.apply(context, args);
        }, wait);
    };
}

export class Observe {

    /**
     * Intercept function call, before function is executed. Can manipulate
     * arguments in callback, if async = false.
     * @param object
     * @param functionName
     * @param callback
     * @param async
     * @returns Object with `remove` function to remove the interceptor
     */
    static preFunction(object, functionName, callback, async = true) {
        if (object.observedPreFunctions === undefined) {
            object.observedPreFunctions = {};
        }
        if (object.observedPreFunctions[functionName] === undefined) {
            object.observedPreFunctions[functionName] = new Set();
            const originalMethod = object[functionName];
            object[functionName] = function () {
                let functionArguments = arguments;
                object.observedPreFunctions[functionName].forEach(function (callback) {
                    const params = {functionName: functionName, arguments: functionArguments};
                    if (async) {
                        setTimeout(() => {
                            callback(params);
                        });
                    } else {
                        const callbackReturn = callback(params);
                        if (callbackReturn) {
                            functionArguments = callbackReturn;
                        }
                    }
                });
                return originalMethod.apply(object, functionArguments);
            };
        }
        object.observedPreFunctions[functionName].add(callback);
        return {
            remove: () => {
                object.observedPreFunctions[functionName].delete(callback);
            }
        }
    };

    /**
     * Intercept function call, after function is executed. Can manipulate
     * returnValue in callback, if async = false.
     * @param object
     * @param functionName
     * @param callback
     * @param async
     * @returns Object with `remove` function to remove the interceptor
     */
    static postFunction(object, functionName, callback, async = true) {
        if (object.observedPostFunctions === undefined) {
            object.observedPostFunctions = {};
        }
        if (object.observedPostFunctions[functionName] === undefined) {
            object.observedPostFunctions[functionName] = new Set();
            const originalMethod = object[functionName];
            object[functionName] = function () {
                let returnValue = originalMethod.apply(object, arguments);
                const functionArguments = arguments;
                object.observedPostFunctions[functionName].forEach(function (callback) {
                    const params = {functionName: functionName, arguments: functionArguments, returnValue: returnValue};
                    if (async) {
                        setTimeout(() => { // async
                            callback(params);
                        });
                    } else {
                        callback(params);
                        returnValue = params.returnValue; // modifiable if called synced
                    }
                });
                return returnValue;
            };
        }
        object.observedPostFunctions[functionName].add(callback);
        return {
            remove: () => {
                object.observedPostFunctions[functionName].delete(callback);
            }
        }
    }

    static property(object, propertyName, callback, async = true) {
        if (object.observedProperties === undefined) {
            object.observedProperties = {};
        }
        if (!object.hasOwnProperty(propertyName)) {
            console.error("Observe.property", object, "missing property: " + propertyName);
        }
        if (object.observedProperties[propertyName] === undefined) {
            object.observedProperties[propertyName] = {
                value: object[propertyName],
                observers: new Set()
            };
            if ($.isArray(object[propertyName])) { // handling for arrays
                const oldSize = object[propertyName].length;
                ARRAY_MANIPULATION_METHODS.forEach(function (methodName) {
                    object[propertyName][methodName] = function () {
                        const newSize = Array.prototype[methodName].apply(this, arguments);
                        object.observedProperties[propertyName].observers.forEach(function (observer) {
                            if (async) {
                                setTimeout(() => { // async
                                    observer(propertyName, oldSize, newSize); // call each addObserver when array changed
                                });
                            } else {
                                observer(propertyName, oldSize, newSize);
                            }
                        });
                        return newSize;
                    };
                });
            } else if (delete object[propertyName]) {
                Object.defineProperty(object, propertyName, {
                    get: function () {
                        return object.observedProperties[propertyName].value;
                    },
                    set: function (newValue) {
                        const oldValue = object.observedProperties[propertyName].value;
                        if (newValue !== oldValue) {
                            object.observedProperties[propertyName].value = newValue;
                            object.observedProperties[propertyName].observers.forEach(function (callback) {
                                if (async) {
                                    setTimeout(() => { // async
                                        callback(propertyName, oldValue, newValue);
                                    });
                                } else {
                                    callback(propertyName, oldValue, newValue);
                                }
                            });
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
            } else {
                console.error("Error Observe.property ", propertyName);
            }
        }
        // add addObserver
        object.observedProperties[propertyName].observers.push(callback);
        callback(propertyName, null, object.observedProperties[propertyName].value);
    }
}