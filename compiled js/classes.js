"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Command = exports.Token = exports.TokenTypes = void 0;
var TokenTypes;
(function (TokenTypes) {
    TokenTypes[TokenTypes["ANY"] = 0] = "ANY";
    TokenTypes[TokenTypes["STR"] = 1] = "STR";
    TokenTypes[TokenTypes["INT"] = 2] = "INT";
})(TokenTypes || (exports.TokenTypes = TokenTypes = {}));
// for lexing and tokenization
// makes parsing easier nad more clean
var Token = /** @class */ (function () {
    function Token(value, type) {
        if (type === void 0) { type = TokenTypes.ANY; }
        this.value = '';
        this.type = 0;
        this.value = value;
        this.type = type;
    }
    Token.prototype.log = function (indent) {
        if (indent === void 0) { indent = ''; }
        console.log("".concat(indent).concat(this.value, " (").concat(this.type, ")"));
    };
    return Token;
}());
exports.Token = Token;
// product of parser
// interpreted bt the interpreter module
var Command = /** @class */ (function () {
    function Command(name, args) {
        if (args === void 0) { args = []; }
        this.name = name;
        this.args = args;
    }
    Command.prototype.log = function () {
        console.log("".concat(this.name, ": "));
        for (var _i = 0, _a = this.args; _i < _a.length; _i++) {
            var tk = _a[_i];
            tk.log('    ');
        }
        console.log('');
    };
    return Command;
}());
exports.Command = Command;
