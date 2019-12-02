const fs = require("fs");
const inquirer = require("inquirer");
const jsonFormat = require("json-format");

var package = JSON.parse(fs.readFileSync("./package.json").toString());
var manifest = JSON.parse(fs.readFileSync("./manifest.json").toString());

var inquirerConfig = [{
        type: "input",
        name: "name",
        message: "Plugin name: ",
        validate: (value) => {
            if (value.trim() == "") {
                return "Must provide plugin name."
            }
            if (value.toLowerCase() != value) {
                return "Name can no longer contain capital letters for npm package."
            }
            return true;
        }
    },
    {
        type: "input",
        name: "description",
        message: "Description: "
    },
    {
        type: "input",
        name: "author",
        message: "Author: ",
    },
    {
        type: "input",
        name: "repo",
        message: "Repository url: "
    },
    {
        type: "confirm",
        default: true,
        name: "clean",
        message: "Do you want to clean all footprint of this init code? ",
    }
];

inquirer.prompt(inquirerConfig).then(answer => {
    // Clean
    delete package.repository;
    delete package.bugs;
    delete package.homepage;

    // handle manifest.json
    manifest.name = answer.name || manifest.name;

    // handle package.json
    package.name = answer.name || package.name;
    package.author = answer.author || package.author;
    package.description = answer.description || package.description;
    if (answer.repo.trim() != "") {
        package.repository = {
            url: answer.repo
        };
        if (answer.repo.indexOf("github.com")) {
            let result;
            if (answer.repo.slice(0, 4) == "http") {
                result = answer.repo.match(/github\.com\/(\S+)\/(\S+)/)
            } else {
                result = answer.repo.match(/github\.com\:(\S+)\/(\S+)/)
            }
            let user = result[1];
            let name = result[2].replace(".git", "");

            package.bugs = {
                url: `https://github.com/${user}/${name}/issues`
            }
            package.homepage = `https://github.com/${user}/${name}#readme`;
        }
    }

    if (answer.clean) {
        delete package.scripts.init;
        fs.unlinkSync("./init.js");
    }

    var manifestData = jsonFormat(manifest, {
        type: 'space',
        size: 4
    });

    var packageData = jsonFormat(package, {
        type: 'space',
        size: 4
    });

    fs.writeFileSync("./manifest.json", manifestData);
    fs.writeFileSync("./package.json", packageData);
});