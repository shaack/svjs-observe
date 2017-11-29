/**
 * Author: shaack
 * Date: 29.11.2017
 */

import {Test} from "../node_modules/svjs-test/src/svjs/Test.js"
import {Observe} from "../src/svjs/Observe.js";
import {ModelMock} from "./mocks/ModelMock.js";

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
            if(callbackCallCount === 1) {
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
            if(callbackCallCount === 1) {
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
            console.log("testArraySync params", params);
        }, false);
        mock.array.push("hello");
    }

}