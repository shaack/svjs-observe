/**
 * Author: shaack
 * Date: 29.11.2017
 */

import {Test} from "../node_modules/svjs-test/src/svjs/Test.js"
import {Observe} from "../src/svjs/Observe.js";
import {ModelMock} from "./mocks/ModelMock.js";

export class TestObservePostFunction extends Test {

    testPostFunction() {
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

}