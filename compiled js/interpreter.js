"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logcode = logcode;
function logcode(code) {
    for (var _i = 0, code_1 = code; _i < code_1.length; _i++) {
        var cmd = code_1[_i];
        cmd.log();
    }
}
