/**
 * Author: shaack
 * Date: 29.11.2017
 */

export class ModelMock {

    constructor() {
        this.property = 10;
        this.array = ["this", "is", "an", "array"];
        this.set = new Set(["this", "is", "a", "Set", "Set"]);
        this.map = new Map();
        this.map.set("one", "this");
        this.map.set("two", "map");
    }

    add(param1, param2) {
        return param1 + param2;
    }

}