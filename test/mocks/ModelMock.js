/**
 * Author: Stefan Haack https://shaack.com
 * License: MIT, (c) 2018 all rights reserved
 */
export class ModelMock {

    constructor() {
        this.property = 10;
        this.array = ["this", "is", "an", "array"];
        this.set = new Set(["this", "is", "a", "Set", "Set"]);
        this.map = new Map();
        this.map.set("one", "this");
        this.map.set("two", "map");
        this.nested = {
            one: 1,
            two: 2,
            three: 3
        };
        this.multiArray = [[1, 2, 3], [4, 5, 6]];
    }

    add(param1, param2) {
        return param1 + param2;
    }

}