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
        const result1 = mock.property1 = 12;
        Test.assertEquals(0, callbackCallCount);
        Test.assertEquals(12, mock.property1);

        // test callback
        let observer = Observe.property(mock, "property1", (params) => {
            callbackCallCount++;
            console.log("params", params);
            if(callbackCallCount === 1) {
                Test.assertEquals("property1", params.propertyName);
                Test.assertEquals(null, params.oldValue);
                Test.assertEquals(12, params.newValue);
            } else if(callbackCallCount === 2) {
                Test.assertEquals("property1", params.propertyName);
                Test.assertEquals(12, params.oldValue);
                Test.assertEquals(42, params.newValue);
            } else {
                // onyl 2 calls, then observer is removed
                assert(false);
            }
        }, false); // mode synced

        mock.property1 = 42;

        // remove callback
        observer.remove();
        mock.property1 = 10;
    }

// Test Array
// Test Set

}