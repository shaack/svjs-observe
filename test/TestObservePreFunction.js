/**
 * Author: shaack
 * Date: 29.11.2017
 */
import {Test} from "../node_modules/svjs-test/src/svjs/Test.js"
import {Observe} from "../src/svjs-observe/Observe.js";
import {ModelMock} from "./mocks/ModelMock.js";

export class TestObservePreFunction extends Test {

    testPreFunction() {
        const mock = new ModelMock()
        let callbackCalled = false
        const result1 = mock.add(3, 4)
        Test.assert(!callbackCalled)
        Test.assertEquals(7, result1)

        // test callback
        let observer = Observe.preFunction(mock, "add", (params) => {
            callbackCalled = true
            Test.assertEquals("add", params.functionName)
            Test.assertEquals(4, params.arguments[1])
        })
        const result2 = mock.add(1, 4)
        Test.assertEquals(5, result2)
        Test.assert(callbackCalled)

        // remove callback
        observer.remove()
        callbackCalled = false
        const result3 = mock.add(4, 7)
        Test.assert(!callbackCalled)
        Test.assertEquals(11, result3)
    }

    testPreFunctionModifyArgument() {
        const mock = new ModelMock();
        Observe.preFunction(mock, "add", (params) => {
            Test.assertEquals("add", params.functionName)
            Test.assertEquals(4, params.arguments[1])
            params.arguments[1] = 2
        })
        const result = mock.add(1, 4)
        Test.assertEquals(3, result)
    }

    testTwoObserversSameObject() {
        const mock = new ModelMock();
        let callbackCalled = false
        Observe.preFunction(mock, "add", (params) => {
            callbackCalled = true
        })
        const result1 = mock.add(1, 1)
        Test.assert(callbackCalled)
        Test.assertEquals(2, result1)
        Observe.preFunction(mock, "add", (params) => {
            callbackCalled = true
            params.arguments[1] = 2
        })
        const result2 = mock.add(2, 1)
        Test.assertEquals(4, result2)
    }
}