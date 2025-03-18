"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rl = void 0;
exports.ask = ask;
exports.readfile = readfile;
var readline = require("readline");
var fs = require("fs");
// Create an interface for reading input
exports.rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
// Function to collect user input
function ask(question) {
    return new Promise(function (resolve) {
        exports.rl.question(question, function (answer) {
            resolve(answer);
        });
    });
}
function readfile(name, encoding) {
    if (encoding === void 0) { encoding = 'utf8'; }
    try {
        return fs.readFileSync(name, encoding);
    }
    catch (err) {
        console.error("Error reading the file: ", err);
        return '';
    }
}
