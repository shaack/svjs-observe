/**
 * Author: shaack
 * Date: 29.11.2017
 */

import {Test} from "../node_modules/svjs-test/src/svjs/Test.js"
import {Observe} from "../src/svjs/Observe.js";
import {ModelMock} from "./mocks/ModelMock.js";

export class TestObservePostFunction extends Test {

    testPostFunctionSync() {
        const mock = new ModelMock();
        let callbackCalled = false;
        const result1 = mock.add(3, 4);
        Test.assert(!callbackCalled);
        Test.assertEquals(7, result1);

        // test callback
        let observer = Observe.postFunction(mock, "add", (params) => {
            callbackCalled = true;
            Test.assertEquals("add", params.functionName);
            Test.assertEquals(4, params.arguments[1]);
            Test.assertEquals(5, params.returnValue);
        }, false); // mode synced
        const result2 = mock.add(1, 4);
        Test.assertEquals(5, result2);
        Test.assert(callbackCalled);

        // remove callback
        observer.remove();
        callbackCalled = false;
        const result3 = mock.add(4, 7);
        Test.assert(!callbackCalled);
        Test.assertEquals(11, result3);
    }

    testPostFunctionModifyReturnValue() {
        const mock = new ModelMock();
        Observe.postFunction(mock, "add", (params) => {
            params.returnValue = 42;
        }, false); // mode synced
        Test.assertEquals(42, mock.add(1, 2));
    }

    testPostFunctionAsync() {
        const mock = new ModelMock();
        let callbackCalled = false;
        let callbackCallCount = 0;
        const result1 = mock.add(3, 4);
        Test.assert(!callbackCalled);
        Test.assertEquals(7, result1);

        // test callback
        let observer = Observe.postFunction(mock, "add", (params) => {
            callbackCalled = true;
            callbackCallCount++;
            Test.assertEquals("add", params.functionName);
            Test.assertEquals(4, params.arguments[1]);
            Test.assertEquals(5, params.returnValue);
        }); // mode async
        const result2 = mock.add(1, 4);
        Test.assertEquals(5, result2);
        Test.assert(!callbackCalled);
        setTimeout(() => { // wait one tick for async
            Test.assert(callbackCalled); // you can see this only in console
            Test.assertEquals(1, callbackCallCount);
        });

        // remove callback
        observer.remove();
        callbackCalled = false;
        const result3 = mock.add(4, 7);
        Test.assert(!callbackCalled);
        Test.assertEquals(11, result3);
    }

}