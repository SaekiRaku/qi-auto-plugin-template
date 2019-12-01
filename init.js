const fs = require("fs");
const inquirer = require("inquirer");
const jsonFormat = require("json-format");

var package = JSON.parse(fs.readFileSync("./package.json").toString());
var manifest = JSON.parse(fs.readFileSync("./manifest.json").toString());


inquirer.prompt([{
        type: "input",
        name: "name",
        message: "Plugin name: ",
    },
    {
        type: "input",
        name: "description",
        message: "Description: ",
    },
    {
        type: "input",
        name: "repo",
        message: "Repository url (https): ",
    },
    {
        type: "confirm",
        default: true,
        name: "clean",
        message: "Do you want to clean all footprint of this init code? ",
    }
]).then(answer => {
    manifest.name = answer.name || manifest.name;

    package.name = answer.name || package.name;
    package.description = answer.description || package.description;
    package.repository.url = "git+" + answer.repo || package.repository.url;

    if (answer.clean) {
        delete package.scripts.init;
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

    if (answer.clean) {
        fs.unlinkSync("./init.js");
    }
});