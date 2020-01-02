import manifest from "./manifest.json";
import QiRollupDev from "@qiqi1996/qi-rollup-dev";
import strip from "@rollup/plugin-strip";
import babel from 'rollup-plugin-babel';


var dev = new QiRollupDev({
    name: manifest.name,
    input: __dirname + "/source/index.js",
    output: __dirname + "/dist/index.js"
})

dev.presets.formats("cjs", "esm");
dev.config.plugins = [babel(), strip()];

const cmd = process.argv[2];

switch (cmd) {
    case "dev":
        dev.watch({
            extra: __dirname + "/example",
            callback(evt) {
                if (evt.code == "ERROR") {
                    console.error(evt);
                    return;
                }
                if (evt.code == "END") {
                    dev.clearCache(/(source|dist|example)/);
                    require("./example/index.js");
                }
            }
        })
    case "build":
        dev.build();
        break;
}