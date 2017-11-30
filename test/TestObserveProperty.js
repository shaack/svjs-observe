/**
 * Author: shaack
 * Date: 29.11.2017
 */

import {Test} from "../node_modules/svjs-test/src/svjs/Test.js"
import {Observe} from "../src/svjs/Observe.js";
import {ModelMock} from "./mocks/ModelMock.js";
import {debounce} from "../src/svjs/Observe.js";

export class TestObserveProperty extends Test {

    testPropertySync() {
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

    testPropertyAsync() {
        const mock = new ModelMock();
        let callbackCallCount = 0;
        mock.property = 8;
        Test.assertEquals(0, callbackCallCount);
        Test.assertEquals(8, mock.property);

        // test callback
        let observer = Observe.property(mock, "property", (params) => {
            callbackCallCount++;
            // console.log("testPropertyAsync params", params);
            if (callbackCallCount === 1) {
                Test.assertEquals("property", params.propertyName);
                Test.assertEquals(8, params.oldValue);
                Test.assertEquals(33, params.newValue);
            } else {
                assert(false);
            }
        }); // mode async

        Test.assertEquals(0, callbackCallCount);
        mock.property = 33;

        Test.assertEquals(0, callbackCallCount);
        // remove callback
        observer.remove();
        mock.property = 10;

        setTimeout(() => {
            Test.assertEquals(1, callbackCallCount);
        });
    }

    testArraySync() {
        const mock = new ModelMock();
        let callbackCallCount = 0;
        mock.array[4] = "ok";
        Test.assertEquals(0, callbackCallCount);
        Test.assertEquals(5, mock.array.length);
        let observer = Observe.property(mock, "array", (params) => {
            callbackCallCount++;
            console.log("testArraySync params", params);
            if (callbackCallCount === 1) {
                Test.assertEquals("array", params.propertyName);
                Test.assertEquals(6, params.newValue.length);
                Test.assertEquals("push", params.methodName);
                Test.assertEquals("hello", params.arguments[0]);
            } else if (callbackCallCount === 2) {
                Test.assertEquals(7, params.newValue.length);
                Test.assertEquals("world", params.arguments[0]);
            } else {
                Test.assert(false);
            }
        }, false);
        mock.array.push("hello");
        mock.array.push("world");
        Test.assertEquals(2, callbackCallCount);
    }

    testSetSync() {
        const mock = new ModelMock();
        let callbackCallCount = 0;
        console.log(mock.set);
        Test.assertEquals(4, mock.set.size);
        let observer = Observe.property(mock, "set", (params) => {
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

    testMapSync() {
        const mock = new ModelMock();
        let callbackCallCount = 0;
        console.log(mock.map);
        Test.assertEquals(2, mock.map.size);
        let observer = Observe.property(mock, "map", (params) => {
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

    testArrayAsync() {
        const mock = new ModelMock();
        let callbackCallCount = 0;
        mock.array[4] = "ok";
        Test.assertEquals(0, callbackCallCount);
        Test.assertEquals(5, mock.array.length);
        let observer = Observe.property(mock, "array", (params) => {
            callbackCallCount++;
            console.log("testArraySync params", params);
            if (callbackCallCount === 1) {
                Test.assertEquals("array", params.propertyName);
                Test.assertEquals(7, params.newValue.length);
                Test.assertEquals("push", params.methodName);
                Test.assertEquals("hello", params.arguments[0]);
            } else if (callbackCallCount === 2) {
                Test.assertEquals(7, params.newValue.length);
                Test.assertEquals("world", params.arguments[0]);
            } else {
                Test.assert(false);
            }
        }, true);
        mock.array.push("hello");
        mock.array.push("world");
        Test.assertEquals(0, callbackCallCount);
        setTimeout(() => {
            Test.assertEquals(2, callbackCallCount);
        })
    }

    testMulti() {
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

    testMultiDebounced() {
        const mock = new ModelMock();
        let callbackCallCount = 0;
        let debounced = debounce(this, (params) => {
            console.log("CALL debouced");
            callbackCallCount++;
            if (callbackCallCount === 1) {
                Test.assertEquals("map", params.propertyName);
                Test.assertEquals(3, params.newValue.size);
                Test.assertEquals("set", params.methodName);
                Test.assertEquals("three", params.arguments[0]);
                Test.assertEquals("add value", params.arguments[1]);
            } else {
                Test.assert(false);
            }
            Test.assertEquals(5, mock.array.length);
            Test.assertEquals(5, mock.set.size);
        },  50);
        let observer = Observe.property(mock, ["array", "set", "map"], debounced, false);
        mock.array.push("hello");
        mock.set.add("world");
        mock.map.set("three", "add value");
        Test.assertEquals(0, callbackCallCount);
        setTimeout(() => {
            console.log("callbackCallCount", callbackCallCount);
            Test.assertEquals(0, callbackCallCount);
        }, 10);
        setTimeout(() => {
            console.log("callbackCallCount", callbackCallCount);
            Test.assertEquals(1, callbackCallCount);
        }, 100);
    }
}