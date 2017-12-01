/**
 * Author: shaack
 * Date: 29.11.2017
 */
import {Test} from "../node_modules/svjs-test/src/svjs/Test.js"
import {Observe} from "../src/svjs/Observe.js";
import {ModelMock} from "./mocks/ModelMock.js";

export class TestObservePreFunction extends Test {

    testPreFunction() {
        const mock = new ModelMock();
        let callbackCalled = false;
        const result1 = mock.add(3, 4);
        Test.assert(!callbackCalled);
        Test.assertEquals(7, result1);

        // test callback
        let observer = Observe.preFunction(mock, "add", (params) => {
            callbackCalled = true;
            Test.assertEquals("add", params.functionName);
            Test.assertEquals(4, params.arguments[1]);
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

    testPreFunctionModifyArgument() {
        const mock = new ModelMock();
        Observe.preFunction(mock, "add", (params) => {
            Test.assertEquals("add", params.functionName);
            Test.assertEquals(4, params.arguments[1]);
            params.arguments[1] = 2;
        }, false); // mode synced
        const result = mock.add(1, 4);
        Test.assertEquals(3, result);
    }
}