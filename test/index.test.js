import assert from "assert";

describe("qi-auto-plugin-template", function () {
    it("should return 'qi-auto' as result", function () {
        let auto = new qiauto({
            "task1": {
                module: require("../dist/index.js"),
                directory: common.path.EXAMPLE
            }
        });

        assert.equal(auto["task1"], "qi-auto")
    });
});