/**
 * Author: shaack
 * Date: 29.11.2017
 */

import {Test} from "../node_modules/svjs-test/src/svjs/Test.js"
import {Observe} from "../src/svjs-observe/Observe.js";
import {ModelMock} from "./mocks/ModelMock.js";

Array.prototype.set = function (index, value) {
    return this.splice(index, 1, value);
};

export class TestObserveProperty extends Test {

    testProperty() {
        const mock = new ModelMock();
        let callbackCallCount = 0;
        mock.property = 12;
        Test.assertEquals(0, callbackCallCount);
        Test.assertEquals(12, mock.property);

        // test callback
        let observer = Observe.property(mock, "property", (params) => {
            callbackCallCount++;
            console.log("params", params);
            if (callbackCallCount === 1) {
                Test.assertEquals("property", params.propertyName);
                Test.assertEquals(12, params.oldValue);
                Test.assertEquals(42, params.newValue);
            } else {
                // only 1 call, then observer is removed
                assert(false);
            }
        }, false); // mode synced

        Test.assertEquals(0, callbackCallCount);
        mock.property = 42;

        Test.assertEquals(1, callbackCallCount);
        // remove callback
        observer.remove();
        mock.property = 10;
    }

    testArray() {
        const mock = new ModelMock();
        let callbackCallCount = 0;
        mock.array[4] = "ok";
        Test.assertEquals(0, callbackCallCount);
        Test.assertEquals(5, mock.array.length);
        Observe.property(mock, "array", (params) => {
            callbackCallCount++;
            if (callbackCallCount === 1) {
                Test.assertEquals("array", params.propertyName);
                Test.assertEquals(6, params.newValue.length);
                Test.assertEquals("push", params.methodName);
                Test.assertEquals("hello", params.arguments[0]);
            } else if (callbackCallCount === 2) {
                Test.assertEquals(7, params.newValue.length);
                Test.assertEquals("world", params.arguments[0]);
            } else if (callbackCallCount === 3) {
                Test.assertEquals(7, params.newValue.length);
                Test.assertEquals("foo", params.arguments[2]);
            } else {
                Test.assert(false);
            }
        }, false);
        mock.array.push("hello");
        mock.array.push("world");
        mock.array.set(3, "foo"); // mock.array.splice(3, 1, "foo");
        Test.assertEquals("foo", mock.array[3]);
        Test.assertEquals("this", mock.array[0]);
        Test.assertEquals(3, callbackCallCount);
    }

    testSet() {
        const mock = new ModelMock();
        let callbackCallCount = 0;
        console.log(mock.set);
        Test.assertEquals(4, mock.set.size);
        Observe.property(mock, "set", (params) => {
            callbackCallCount++;
            console.log("testSetSync params", params);
            if (callbackCallCount === 1) {
                Test.assertEquals("set", params.propertyName);
                Test.assertEquals(5, params.newValue.size);
                Test.assertEquals("add", params.methodName);
                Test.assertEquals("hello", params.arguments[0]);
            } else {
                Test.assert(false);
            }
        }, false);
        mock.set.add("hello");
        Test.assertEquals(1, callbackCallCount);
    }

    testMap() {
        const mock = new ModelMock();
        let callbackCallCount = 0;
        console.log(mock.map);
        Test.assertEquals(2, mock.map.size);
        Observe.property(mock, "map", (params) => {
            callbackCallCount++;
            console.log("testMapSync params", params);
            if (callbackCallCount === 1) {
                Test.assertEquals("map", params.propertyName);
                Test.assertEquals(2, params.newValue.size);
                Test.assertEquals("set", params.methodName);
                Test.assertEquals("one", params.arguments[0]);
                Test.assertEquals("another value", params.arguments[1]);
            } else if (callbackCallCount === 2) {
                Test.assertEquals("map", params.propertyName);
                Test.assertEquals(3, params.newValue.size);
                Test.assertEquals("set", params.methodName);
                Test.assertEquals("three", params.arguments[0]);
            } else {
                Test.assert(false);
            }
        }, false);
        mock.map.set("one", "another value");
        mock.map.set("three", "add value");
        Test.assertEquals(2, callbackCallCount);
    }

    testMultipleProperties() {
        const mock = new ModelMock();
        let callbackCallCount = 0;
        let observer = Observe.property(mock, ["array", "set", "map"], (params) => {
            callbackCallCount++;
            if (callbackCallCount === 1) {
                Test.assertEquals("array", params.propertyName);
                Test.assertEquals(5, params.newValue.length);
                Test.assertEquals("push", params.methodName);
                Test.assertEquals("hello", params.arguments[0]);
            } else if (callbackCallCount === 2) {
                Test.assertEquals("set", params.propertyName);
                Test.assertEquals(5, params.newValue.size);
                Test.assertEquals("add", params.methodName);
                Test.assertEquals("world", params.arguments[0]);
            } else if (callbackCallCount === 3) {
                Test.assertEquals("map", params.propertyName);
                Test.assertEquals(3, params.newValue.size);
                Test.assertEquals("set", params.methodName);
                Test.assertEquals("three", params.arguments[0]);
                Test.assertEquals("add value", params.arguments[1]);
            } else {
                Test.assert(false);
            }
        }, false);
        mock.array.push("hello");
        mock.set.add("world");
        mock.map.set("three", "add value");
        Test.assertEquals(3, callbackCallCount);
        observer.remove();
        mock.array.push("hello");
        mock.set.add("world");
        mock.map.set("three", "add value");
        Test.assertEquals(3, callbackCallCount);
    }

    testNested() {
        const mock = new ModelMock();
        let callbackCallCount = 0;
        Observe.property(mock.nested, "one", (params) => {
            callbackCallCount++;
        });
        mock.nested.one = 42;
        Test.assertEquals(1, callbackCallCount);
    }

    testMultiArray() {
        const mock = new ModelMock();
        let callbackCallCount = 0;
        let callback = (params) => {
            callbackCallCount++;
            console.log("callback", params);
        };
        for (let i = 0; i < mock.multiArray.length; i++) {
            Observe.property(mock.multiArray, i, callback);
        }
        mock.multiArray[1].splice(1, 1, 42);
        Test.assertEquals(1, callbackCallCount);
        Test.assertEquals(42, mock.multiArray[1][1]);
    }
}